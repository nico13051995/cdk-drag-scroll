import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, NgZone, Input, ChangeDetectorRef } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AutoScroll } from './auto-scroll';
import { DragDebugService } from './drag-debug.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/drag-drop";
import * as i2 from "./drag-debug.service";
export class DragScrollDirective {
    constructor(cdkDrag, dragDebugService, zone, changeDetectorRef) {
        this.cdkDrag = cdkDrag;
        this.dragDebugService = dragDebugService;
        this.zone = zone;
        this.changeDetectorRef = changeDetectorRef;
        this.destroy$ = new Subject();
        this.stopDragging$ = new Subject();
        this.lastScroll = {
            top: 0,
            left: 0
        };
        this.dragRef = this.cdkDrag['_dragRef'];
        if (this.dragRef) {
            this.zone.runOutsideAngular(() => {
                this.dragRef.started.pipe(takeUntil(this.destroy$)).subscribe(event => {
                    this.log('Started', event, this.dragRef.isDragging());
                    this.started();
                });
                this.dragRef.ended.pipe(takeUntil(this.destroy$)).subscribe(event => {
                    this.log('Ended', event);
                    this.ended();
                });
                this.dragRef.entered.pipe(takeUntil(this.destroy$)).subscribe(event => {
                    this.log('Entered', event);
                    this.entered();
                });
                this.dragRef.exited.pipe(takeUntil(this.destroy$)).subscribe(event => {
                    this.log('Exited', event);
                    this.exited();
                });
            });
        }
        else {
            this.log('CdkDrag not found', this.cdkDrag, this.dragRef);
        }
    }
    ngOnChanges(changes) {
        if (changes.dragConnectedIds) {
            if (this.dragRef.isDragging()) {
                // https://github.com/angular/material2/issues/15343
                setTimeout(() => {
                    this.syncSiblings();
                });
            }
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.stopDragging$.next();
        this.stopDragging$.complete();
        this.destroyAutoScroll();
    }
    started() {
        if (!this.scrollContainer) {
            return;
        }
        this.destroyAutoScroll();
        this.addDebugInfo();
        this.autoScroll = new AutoScroll(this.scrollContainer);
        this.lastScroll.top = this.scrollContainer.scrollTop;
        this.lastScroll.left = this.scrollContainer.scrollLeft;
        fromEvent(this.scrollContainer, 'scroll')
            .pipe(takeUntil(this.stopDragging$))
            .subscribe(() => {
            const deltaX = this.scrollContainer.scrollLeft - this.lastScroll.left;
            const deltaY = this.scrollContainer.scrollTop - this.lastScroll.top;
            if (deltaX || deltaY) {
                this.handleScroll(deltaX, deltaY);
            }
            this.lastScroll.top = this.scrollContainer.scrollTop;
            this.lastScroll.left = this.scrollContainer.scrollLeft;
        });
        this.dragRef.moved
            .pipe(debounceTime(10), takeUntil(this.stopDragging$))
            .subscribe(e => {
            this.autoScroll.onMove(e.pointerPosition);
        });
    }
    ended() {
        this.destroyAutoScroll();
        this.stopDragging$.next();
        this.dragDebugService.reset();
    }
    entered() {
        this.dragFixContainer();
    }
    exited() {
        this.dragFixContainer();
    }
    handleScroll(x, y) {
        const dropListRef = this.getDropListRef();
        // adjust containers
        this.adjustContainers();
        // adjust items
        this.adjustItems(x, y);
        // ToDo: better condition for changed items
        if (dropListRef._draggables.length > dropListRef._itemPositions.length) {
            this.syncItems();
        }
        this.addDebugInfo();
    }
    destroyAutoScroll() {
        if (this.autoScroll) {
            this.autoScroll.destroy();
            this.autoScroll = null;
        }
    }
    getDropListRef() {
        return this.dragRef['_dropContainer'];
    }
    addDebugInfo() {
        if (!this.dragDebugService.enabled) {
            return;
        }
        const dropListRef = this.getDropListRef();
        const draws = [
            ...dropListRef._itemPositions.map(it => ({
                clientRect: it.clientRect,
                color: 'blue',
                id: it.drag.data.data.name
            })),
            ...dropListRef._siblings.map(it => ({
                clientRect: it._clientRect,
                color: 'green',
                id: ''
            })),
            {
                clientRect: dropListRef._clientRect,
                color: '#2FD1BB',
                id: ''
            }
        ];
        this.dragDebugService.log(draws.filter(d => d.clientRect));
    }
    dragFixContainer() {
        // https://github.com/angular/material2/issues/15227
        setTimeout(() => {
            const dropListRef = this.getDropListRef();
            dropListRef._cacheParentPositions();
            this.addDebugInfo();
        });
        // fix for issue when classes is not resetted
        this.changeDetectorRef.markForCheck();
    }
    syncSiblings() {
        const dropListRef = this.getDropListRef();
        this.log('syncSiblings before', dropListRef._siblings.length);
        dropListRef.beforeStarted.next();
        this.log('syncSiblings after', dropListRef._siblings.length);
        this.adjustContainers();
    }
    syncItems() {
        const dropListRef = this.getDropListRef();
        const oldPositions = dropListRef._itemPositions;
        dropListRef._activeDraggables = dropListRef._draggables.slice();
        dropListRef._cacheItemPositions();
        const newPositions = dropListRef._itemPositions;
        dropListRef._itemPositions = [...oldPositions];
        newPositions.forEach(p => {
            if (!oldPositions.find(p1 => p.drag === p1.drag)) {
                dropListRef._itemPositions.push(p);
            }
        });
        dropListRef._activeDraggables.push(this.dragRef);
    }
    adjustContainers() {
        const dropListRef = this.getDropListRef();
        dropListRef._cacheParentPositions();
    }
    adjustItems(deltaX, deltaY) {
        const dropListRef = this.getDropListRef();
        dropListRef._itemPositions.forEach(it => {
            it.originalRect = it.originalRect || it.clientRect;
            it.clientRect = Object.assign(Object.assign({}, it.clientRect), { left: it.clientRect.left - deltaX, right: it.clientRect.right - deltaX, top: it.clientRect.top - deltaY, bottom: it.clientRect.bottom - deltaY });
        });
    }
    log(message, ...optionalParams) {
        if (this.dragDebugService.enabled) {
            console.log(message, optionalParams);
        }
    }
}
DragScrollDirective.ɵfac = function DragScrollDirective_Factory(t) { return new (t || DragScrollDirective)(i0.ɵɵdirectiveInject(i1.CdkDrag), i0.ɵɵdirectiveInject(i2.DragDebugService), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
DragScrollDirective.ɵdir = i0.ɵɵdefineDirective({ type: DragScrollDirective, selectors: [["", "vsDragScroll", ""]], inputs: { dragConnectedIds: ["vsDragScrollConnectedTo", "dragConnectedIds"], scrollContainer: ["vsDragScrollContainer", "scrollContainer"] }, exportAs: ["vsDragScroll"], features: [i0.ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DragScrollDirective, [{
        type: Directive,
        args: [{
                selector: '[vsDragScroll]',
                exportAs: 'vsDragScroll'
            }]
    }], function () { return [{ type: i1.CdkDrag }, { type: i2.DragDebugService }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, { dragConnectedIds: [{
            type: Input,
            args: ['vsDragScrollConnectedTo']
        }], scrollContainer: [{
            type: Input,
            args: ['vsDragScrollContainer']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2RrLWRyYWctc2Nyb2xsLyIsInNvdXJjZXMiOlsibGliL2RyYWctc2Nyb2xsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUF3QixNQUFNLHdCQUF3QixDQUFDO0FBQ3ZFLE9BQU8sRUFDTCxTQUFTLEVBRVQsTUFBTSxFQUNOLEtBQUssRUFDTCxpQkFBaUIsRUFHbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7O0FBTXhELE1BQU0sT0FBTyxtQkFBbUI7SUFhOUIsWUFDVSxPQUFnQixFQUNoQixnQkFBa0MsRUFDbEMsSUFBWSxFQUNaLGlCQUFvQztRQUhwQyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFoQjlDLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUdwQyxlQUFVLEdBQUc7WUFDWCxHQUFHLEVBQUUsQ0FBQztZQUNOLElBQUksRUFBRSxDQUFDO1NBQ1IsQ0FBQztRQVdBLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV4QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElB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QUFFO1lBQ3RDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxVQUFVLG1DQUNSLEVBQUUsQ0FBQyxVQUFVLEtBQ2hCLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxNQUFNLEVBQ2pDLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxNQUFNLEVBQ25DLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxNQUFNLEVBQy9CLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQ3RDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxHQUFHLENBQUMsT0FBYSxFQUFFLEdBQUcsY0FBcUI7UUFDakQsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO1lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQzs7c0ZBek9VLG1CQUFtQjt3REFBbkIsbUJBQW1CO2tEQUFuQixtQkFBbUI7Y0FKL0IsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRSxjQUFjO2FBQ3pCOztrQkFXRSxLQUFLO21CQUFDLHlCQUF5Qjs7a0JBQy9CLEtBQUs7bUJBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2RrRHJhZywgRHJhZ1JlZiwgRHJvcExpc3RSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHtcclxuICBEaXJlY3RpdmUsXHJcbiAgT25EZXN0cm95LFxyXG4gIE5nWm9uZSxcclxuICBJbnB1dCxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE9uQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFrZVVudGlsLCBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEF1dG9TY3JvbGwgfSBmcm9tICcuL2F1dG8tc2Nyb2xsJztcclxuaW1wb3J0IHsgRHJhZ0RlYnVnU2VydmljZSB9IGZyb20gJy4vZHJhZy1kZWJ1Zy5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW3ZzRHJhZ1Njcm9sbF0nLFxyXG4gIGV4cG9ydEFzOiAndnNEcmFnU2Nyb2xsJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRHJhZ1Njcm9sbERpcmVjdGl2ZTxUID0gYW55PiBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcclxuICBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgc3RvcERyYWdnaW5nJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgZHJhZ1JlZjogRHJhZ1JlZjxDZGtEcmFnPFQ+PjtcclxuICBhdXRvU2Nyb2xsOiBBdXRvU2Nyb2xsO1xyXG4gIGxhc3RTY3JvbGwgPSB7XHJcbiAgICB0b3A6IDAsXHJcbiAgICBsZWZ0OiAwXHJcbiAgfTtcclxuXHJcbiAgQElucHV0KCd2c0RyYWdTY3JvbGxDb25uZWN0ZWRUbycpIGRyYWdDb25uZWN0ZWRJZHM6IHN0cmluZ1tdO1xyXG4gIEBJbnB1dCgndnNEcmFnU2Nyb2xsQ29udGFpbmVyJykgc2Nyb2xsQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGNka0RyYWc6IENka0RyYWcsXHJcbiAgICBwcml2YXRlIGRyYWdEZWJ1Z1NlcnZpY2U6IERyYWdEZWJ1Z1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXHJcbiAgKSB7XHJcbiAgICB0aGlzLmRyYWdSZWYgPSB0aGlzLmNka0RyYWdbJ19kcmFnUmVmJ107XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ1JlZikge1xyXG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZHJhZ1JlZi5zdGFydGVkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coJ1N0YXJ0ZWQnLCBldmVudCwgdGhpcy5kcmFnUmVmLmlzRHJhZ2dpbmcoKSk7XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0ZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnUmVmLmVuZGVkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coJ0VuZGVkJywgZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5lbmRlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdSZWYuZW50ZXJlZC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcclxuICAgICAgICAgIHRoaXMubG9nKCdFbnRlcmVkJywgZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5lbnRlcmVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ1JlZi5leGl0ZWQucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShldmVudCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZygnRXhpdGVkJywgZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5leGl0ZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvZygnQ2RrRHJhZyBub3QgZm91bmQnLCB0aGlzLmNka0RyYWcsIHRoaXMuZHJhZ1JlZik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5kcmFnQ29ubmVjdGVkSWRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdSZWYuaXNEcmFnZ2luZygpKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyL2lzc3Vlcy8xNTM0M1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zeW5jU2libGluZ3MoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcclxuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcclxuICAgIHRoaXMuc3RvcERyYWdnaW5nJC5uZXh0KCk7XHJcbiAgICB0aGlzLnN0b3BEcmFnZ2luZyQuY29tcGxldGUoKTtcclxuICAgIHRoaXMuZGVzdHJveUF1dG9TY3JvbGwoKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0ZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3lBdXRvU2Nyb2xsKCk7XHJcblxyXG4gICAgdGhpcy5hZGREZWJ1Z0luZm8oKTtcclxuXHJcbiAgICB0aGlzLmF1dG9TY3JvbGwgPSBuZXcgQXV0b1Njcm9sbCh0aGlzLnNjcm9sbENvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5sYXN0U2Nyb2xsLnRvcCA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcDtcclxuICAgIHRoaXMubGFzdFNjcm9sbC5sZWZ0ID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcclxuXHJcbiAgICBmcm9tRXZlbnQodGhpcy5zY3JvbGxDb250YWluZXIsICdzY3JvbGwnKVxyXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5zdG9wRHJhZ2dpbmckKSlcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVsdGFYID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdCAtIHRoaXMubGFzdFNjcm9sbC5sZWZ0O1xyXG4gICAgICAgIGNvbnN0IGRlbHRhWSA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcCAtIHRoaXMubGFzdFNjcm9sbC50b3A7XHJcblxyXG4gICAgICAgIGlmIChkZWx0YVggfHwgZGVsdGFZKSB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZVNjcm9sbChkZWx0YVgsIGRlbHRhWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxhc3RTY3JvbGwudG9wID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wO1xyXG4gICAgICAgIHRoaXMubGFzdFNjcm9sbC5sZWZ0ID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5kcmFnUmVmLm1vdmVkXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGRlYm91bmNlVGltZSgxMCksXHJcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuc3RvcERyYWdnaW5nJClcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKGUgPT4ge1xyXG4gICAgICAgIHRoaXMuYXV0b1Njcm9sbC5vbk1vdmUoZS5wb2ludGVyUG9zaXRpb24pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGVuZGVkKCkge1xyXG4gICAgdGhpcy5kZXN0cm95QXV0b1Njcm9sbCgpO1xyXG4gICAgdGhpcy5zdG9wRHJhZ2dpbmckLm5leHQoKTtcclxuICAgIHRoaXMuZHJhZ0RlYnVnU2VydmljZS5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgZW50ZXJlZCgpIHtcclxuICAgIHRoaXMuZHJhZ0ZpeENvbnRhaW5lcigpO1xyXG4gIH1cclxuXHJcbiAgZXhpdGVkKCkge1xyXG4gICAgdGhpcy5kcmFnRml4Q29udGFpbmVyKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZVNjcm9sbCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZHJvcExpc3RSZWY6IGFueSA9IHRoaXMuZ2V0RHJvcExpc3RSZWYoKTtcclxuXHJcbiAgICAvLyBhZGp1c3QgY29udGFpbmVyc1xyXG4gICAgdGhpcy5hZGp1c3RDb250YWluZXJzKCk7XHJcblxyXG4gICAgLy8gYWRqdXN0IGl0ZW1zXHJcbiAgICB0aGlzLmFkanVzdEl0ZW1zKHgsIHkpO1xyXG5cclxuICAgIC8vIFRvRG86IGJldHRlciBjb25kaXRpb24gZm9yIGNoYW5nZWQgaXRlbXNcclxuICAgIGlmIChkcm9wTGlzdFJlZi5fZHJhZ2dhYmxlcy5sZW5ndGggPiBkcm9wTGlzdFJlZi5faXRlbVBvc2l0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zeW5jSXRlbXMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFkZERlYnVnSW5mbygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZXN0cm95QXV0b1Njcm9sbCgpIHtcclxuICAgIGlmICh0aGlzLmF1dG9TY3JvbGwpIHtcclxuICAgICAgdGhpcy5hdXRvU2Nyb2xsLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5hdXRvU2Nyb2xsID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RHJvcExpc3RSZWYoKTogRHJvcExpc3RSZWYge1xyXG4gICAgcmV0dXJuIHRoaXMuZHJhZ1JlZlsnX2Ryb3BDb250YWluZXInXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkRGVidWdJbmZvKCkge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdEZWJ1Z1NlcnZpY2UuZW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkcm9wTGlzdFJlZjogYW55ID0gdGhpcy5nZXREcm9wTGlzdFJlZigpO1xyXG4gICAgY29uc3QgZHJhd3MgPSBbXHJcbiAgICAgIC4uLmRyb3BMaXN0UmVmLl9pdGVtUG9zaXRpb25zLm1hcChpdCA9PiAoe1xyXG4gICAgICAgIGNsaWVudFJlY3Q6IGl0LmNsaWVudFJlY3QsXHJcbiAgICAgICAgY29sb3I6ICdibHVlJyxcclxuICAgICAgICBpZDogaXQuZHJhZy5kYXRhLmRhdGEubmFtZVxyXG4gICAgICB9KSksXHJcbiAgICAgIC4uLmRyb3BMaXN0UmVmLl9zaWJsaW5ncy5tYXAoaXQgPT4gKHtcclxuICAgICAgICBjbGllbnRSZWN0OiBpdC5fY2xpZW50UmVjdCxcclxuICAgICAgICBjb2xvcjogJ2dyZWVuJyxcclxuICAgICAgICBpZDogJydcclxuICAgICAgfSkpLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2xpZW50UmVjdDogZHJvcExpc3RSZWYuX2NsaWVudFJlY3QsXHJcbiAgICAgICAgY29sb3I6ICcjMkZEMUJCJyxcclxuICAgICAgICBpZDogJydcclxuICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmRyYWdEZWJ1Z1NlcnZpY2UubG9nKGRyYXdzLmZpbHRlcihkID0+IGQuY2xpZW50UmVjdCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmFnRml4Q29udGFpbmVyKCkge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyL2lzc3Vlcy8xNTIyN1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGRyb3BMaXN0UmVmOiBhbnkgPSB0aGlzLmdldERyb3BMaXN0UmVmKCk7XHJcbiAgICAgIGRyb3BMaXN0UmVmLl9jYWNoZVBhcmVudFBvc2l0aW9ucygpO1xyXG4gICAgICB0aGlzLmFkZERlYnVnSW5mbygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gZml4IGZvciBpc3N1ZSB3aGVuIGNsYXNzZXMgaXMgbm90IHJlc2V0dGVkXHJcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzeW5jU2libGluZ3MoKSB7XHJcbiAgICBjb25zdCBkcm9wTGlzdFJlZjogYW55ID0gdGhpcy5nZXREcm9wTGlzdFJlZigpO1xyXG4gICAgdGhpcy5sb2coJ3N5bmNTaWJsaW5ncyBiZWZvcmUnLCBkcm9wTGlzdFJlZi5fc2libGluZ3MubGVuZ3RoKTtcclxuICAgIGRyb3BMaXN0UmVmLmJlZm9yZVN0YXJ0ZWQubmV4dCgpO1xyXG4gICAgdGhpcy5sb2coJ3N5bmNTaWJsaW5ncyBhZnRlcicsIGRyb3BMaXN0UmVmLl9zaWJsaW5ncy5sZW5ndGgpO1xyXG4gICAgdGhpcy5hZGp1c3RDb250YWluZXJzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN5bmNJdGVtcygpIHtcclxuICAgIGNvbnN0IGRyb3BMaXN0UmVmOiBhbnkgPSB0aGlzLmdldERyb3BMaXN0UmVmKCk7XHJcblxyXG4gICAgY29uc3Qgb2xkUG9zaXRpb25zID0gZHJvcExpc3RSZWYuX2l0ZW1Qb3NpdGlvbnM7XHJcbiAgICBkcm9wTGlzdFJlZi5fYWN0aXZlRHJhZ2dhYmxlcyA9IGRyb3BMaXN0UmVmLl9kcmFnZ2FibGVzLnNsaWNlKCk7XHJcblxyXG4gICAgZHJvcExpc3RSZWYuX2NhY2hlSXRlbVBvc2l0aW9ucygpO1xyXG4gICAgY29uc3QgbmV3UG9zaXRpb25zID0gZHJvcExpc3RSZWYuX2l0ZW1Qb3NpdGlvbnM7XHJcbiAgICBkcm9wTGlzdFJlZi5faXRlbVBvc2l0aW9ucyA9IFsuLi5vbGRQb3NpdGlvbnNdO1xyXG4gICAgbmV3UG9zaXRpb25zLmZvckVhY2gocCA9PiB7XHJcbiAgICAgIGlmICghb2xkUG9zaXRpb25zLmZpbmQocDEgPT4gcC5kcmFnID09PSBwMS5kcmFnKSkge1xyXG4gICAgICAgIGRyb3BMaXN0UmVmLl9pdGVtUG9zaXRpb25zLnB1c2gocCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgZHJvcExpc3RSZWYuX2FjdGl2ZURyYWdnYWJsZXMucHVzaCh0aGlzLmRyYWdSZWYpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGp1c3RDb250YWluZXJzKCkge1xyXG4gICAgY29uc3QgZHJvcExpc3RSZWY6IGFueSA9IHRoaXMuZ2V0RHJvcExpc3RSZWYoKTtcclxuICAgIGRyb3BMaXN0UmVmLl9jYWNoZVBhcmVudFBvc2l0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGp1c3RJdGVtcyhkZWx0YVg6IG51bWJlciwgZGVsdGFZOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGRyb3BMaXN0UmVmOiBhbnkgPSB0aGlzLmdldERyb3BMaXN0UmVmKCk7XHJcbiAgICBkcm9wTGlzdFJlZi5faXRlbVBvc2l0aW9ucy5mb3JFYWNoKGl0ID0+IHtcclxuICAgICAgaXQub3JpZ2luYWxSZWN0ID0gaXQub3JpZ2luYWxSZWN0IHx8IGl0LmNsaWVudFJlY3Q7XHJcbiAgICAgIGl0LmNsaWVudFJlY3QgPSB7XHJcbiAgICAgICAgLi4uaXQuY2xpZW50UmVjdCxcclxuICAgICAgICBsZWZ0OiBpdC5jbGllbnRSZWN0LmxlZnQgLSBkZWx0YVgsXHJcbiAgICAgICAgcmlnaHQ6IGl0LmNsaWVudFJlY3QucmlnaHQgLSBkZWx0YVgsXHJcbiAgICAgICAgdG9wOiBpdC5jbGllbnRSZWN0LnRvcCAtIGRlbHRhWSxcclxuICAgICAgICBib3R0b206IGl0LmNsaWVudFJlY3QuYm90dG9tIC0gZGVsdGFZXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9nKG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xyXG4gICAgaWYgKHRoaXMuZHJhZ0RlYnVnU2VydmljZS5lbmFibGVkKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIG9wdGlvbmFsUGFyYW1zKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19