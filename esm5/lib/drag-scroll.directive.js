import { __assign, __read, __spread } from "tslib";
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, NgZone, Input, ChangeDetectorRef } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AutoScroll } from './auto-scroll';
import { DragDebugService } from './drag-debug.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/drag-drop";
import * as i2 from "./drag-debug.service";
var DragScrollDirective = /** @class */ (function () {
    function DragScrollDirective(cdkDrag, dragDebugService, zone, changeDetectorRef) {
        var _this = this;
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
            this.zone.runOutsideAngular(function () {
                _this.dragRef.started.pipe(takeUntil(_this.destroy$)).subscribe(function (event) {
                    _this.log('Started', event, _this.dragRef.isDragging());
                    _this.started();
                });
                _this.dragRef.ended.pipe(takeUntil(_this.destroy$)).subscribe(function (event) {
                    _this.log('Ended', event);
                    _this.ended();
                });
                _this.dragRef.entered.pipe(takeUntil(_this.destroy$)).subscribe(function (event) {
                    _this.log('Entered', event);
                    _this.entered();
                });
                _this.dragRef.exited.pipe(takeUntil(_this.destroy$)).subscribe(function (event) {
                    _this.log('Exited', event);
                    _this.exited();
                });
            });
        }
        else {
            this.log('CdkDrag not found', this.cdkDrag, this.dragRef);
        }
    }
    DragScrollDirective.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.dragConnectedIds) {
            if (this.dragRef.isDragging()) {
                // https://github.com/angular/material2/issues/15343
                setTimeout(function () {
                    _this.syncSiblings();
                });
            }
        }
    };
    DragScrollDirective.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.complete();
        this.stopDragging$.next();
        this.stopDragging$.complete();
        this.destroyAutoScroll();
    };
    DragScrollDirective.prototype.started = function () {
        var _this = this;
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
            .subscribe(function () {
            var deltaX = _this.scrollContainer.scrollLeft - _this.lastScroll.left;
            var deltaY = _this.scrollContainer.scrollTop - _this.lastScroll.top;
            if (deltaX || deltaY) {
                _this.handleScroll(deltaX, deltaY);
            }
            _this.lastScroll.top = _this.scrollContainer.scrollTop;
            _this.lastScroll.left = _this.scrollContainer.scrollLeft;
        });
        this.dragRef.moved
            .pipe(debounceTime(10), takeUntil(this.stopDragging$))
            .subscribe(function (e) {
            _this.autoScroll.onMove(e.pointerPosition);
        });
    };
    DragScrollDirective.prototype.ended = function () {
        this.destroyAutoScroll();
        this.stopDragging$.next();
        this.dragDebugService.reset();
    };
    DragScrollDirective.prototype.entered = function () {
        this.dragFixContainer();
    };
    DragScrollDirective.prototype.exited = function () {
        this.dragFixContainer();
    };
    DragScrollDirective.prototype.handleScroll = function (x, y) {
        var dropListRef = this.getDropListRef();
        // adjust containers
        this.adjustContainers();
        // adjust items
        this.adjustItems(x, y);
        // ToDo: better condition for changed items
        if (dropListRef._draggables.length > dropListRef._itemPositions.length) {
            this.syncItems();
        }
        this.addDebugInfo();
    };
    DragScrollDirective.prototype.destroyAutoScroll = function () {
        if (this.autoScroll) {
            this.autoScroll.destroy();
            this.autoScroll = null;
        }
    };
    DragScrollDirective.prototype.getDropListRef = function () {
        return this.dragRef['_dropContainer'];
    };
    DragScrollDirective.prototype.addDebugInfo = function () {
        if (!this.dragDebugService.enabled) {
            return;
        }
        var dropListRef = this.getDropListRef();
        var draws = __spread(dropListRef._itemPositions.map(function (it) { return ({
            clientRect: it.clientRect,
            color: 'blue',
            id: it.drag.data.data.name
        }); }), dropListRef._siblings.map(function (it) { return ({
            clientRect: it._clientRect,
            color: 'green',
            id: ''
        }); }), [
            {
                clientRect: dropListRef._clientRect,
                color: '#2FD1BB',
                id: ''
            }
        ]);
        this.dragDebugService.log(draws.filter(function (d) { return d.clientRect; }));
    };
    DragScrollDirective.prototype.dragFixContainer = function () {
        var _this = this;
        // https://github.com/angular/material2/issues/15227
        setTimeout(function () {
            var dropListRef = _this.getDropListRef();
            dropListRef._cacheItemPositions();
            _this.addDebugInfo();
        });
        // fix for issue when classes is not resetted
        this.changeDetectorRef.markForCheck();
    };
    DragScrollDirective.prototype.syncSiblings = function () {
        var dropListRef = this.getDropListRef();
        this.log('syncSiblings before', dropListRef._siblings.length);
        dropListRef.beforeStarted.next();
        this.log('syncSiblings after', dropListRef._siblings.length);
        this.adjustContainers();
    };
    DragScrollDirective.prototype.syncItems = function () {
        var dropListRef = this.getDropListRef();
        var oldPositions = dropListRef._itemPositions;
        dropListRef._activeDraggables = dropListRef._draggables.slice();
        dropListRef._cacheItemPositions();
        var newPositions = dropListRef._itemPositions;
        dropListRef._itemPositions = __spread(oldPositions);
        newPositions.forEach(function (p) {
            if (!oldPositions.find(function (p1) { return p.drag === p1.drag; })) {
                dropListRef._itemPositions.push(p);
            }
        });
        dropListRef._activeDraggables.push(this.dragRef);
    };
    DragScrollDirective.prototype.adjustContainers = function () {
        var dropListRef = this.getDropListRef();
        dropListRef._cacheItemPositions();
        // dropListRef._siblings.forEach(sibling => {
        // sibling._cacheOwnPosition();
        // });
    };
    DragScrollDirective.prototype.adjustItems = function (deltaX, deltaY) {
        var dropListRef = this.getDropListRef();
        dropListRef._itemPositions.forEach(function (it) {
            it.originalRect = it.originalRect || it.clientRect;
            it.clientRect = __assign(__assign({}, it.clientRect), { left: it.clientRect.left - deltaX, right: it.clientRect.right - deltaX, top: it.clientRect.top - deltaY, bottom: it.clientRect.bottom - deltaY });
        });
    };
    DragScrollDirective.prototype.log = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (this.dragDebugService.enabled) {
            console.log(message, optionalParams);
        }
    };
    DragScrollDirective.ɵfac = function DragScrollDirective_Factory(t) { return new (t || DragScrollDirective)(i0.ɵɵdirectiveInject(i1.CdkDrag), i0.ɵɵdirectiveInject(i2.DragDebugService), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    DragScrollDirective.ɵdir = i0.ɵɵdefineDirective({ type: DragScrollDirective, selectors: [["", "vsDragScroll", ""]], inputs: { dragConnectedIds: ["vsDragScrollConnectedTo", "dragConnectedIds"], scrollContainer: ["vsDragScrollContainer", "scrollContainer"] }, exportAs: ["vsDragScroll"], features: [i0.ɵɵNgOnChangesFeature] });
    return DragScrollDirective;
}());
export { DragScrollDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2RrLWRyYWctc2Nyb2xsLyIsInNvdXJjZXMiOlsibGliL2RyYWctc2Nyb2xsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLE9BQU8sRUFBd0IsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RSxPQUFPLEVBQ0wsU0FBUyxFQUVULE1BQU0sRUFDTixLQUFLLEVBQ0wsaUJBQWlCLEVBR2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7OztBQUV4RDtJQWlCRSw2QkFDVSxPQUFnQixFQUNoQixnQkFBa0MsRUFDbEMsSUFBWSxFQUNaLGlCQUFvQztRQUo5QyxpQkFpQ0M7UUFoQ1MsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBaEI5QyxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUMvQixrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFHcEMsZUFBVSxHQUFHO1lBQ1gsR0FBRyxFQUFFLENBQUM7WUFDTixJQUFJLEVBQUUsQ0FBQztTQUNSLENBQUM7UUFXQSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxJQUFJ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ZiwgRHJvcExpc3RSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuaW1wb3J0IHtcclxuICBEaXJlY3RpdmUsXHJcbiAgT25EZXN0cm95LFxyXG4gIE5nWm9uZSxcclxuICBJbnB1dCxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE9uQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0LCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGFrZVVudGlsLCBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IEF1dG9TY3JvbGwgfSBmcm9tICcuL2F1dG8tc2Nyb2xsJztcclxuaW1wb3J0IHsgRHJhZ0RlYnVnU2VydmljZSB9IGZyb20gJy4vZHJhZy1kZWJ1Zy5zZXJ2aWNlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW3ZzRHJhZ1Njcm9sbF0nLFxyXG4gIGV4cG9ydEFzOiAndnNEcmFnU2Nyb2xsJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRHJhZ1Njcm9sbERpcmVjdGl2ZTxUID0gYW55PiBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcclxuICBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgc3RvcERyYWdnaW5nJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgZHJhZ1JlZjogRHJhZ1JlZjxDZGtEcmFnPFQ+PjtcclxuICBhdXRvU2Nyb2xsOiBBdXRvU2Nyb2xsO1xyXG4gIGxhc3RTY3JvbGwgPSB7XHJcbiAgICB0b3A6IDAsXHJcbiAgICBsZWZ0OiAwXHJcbiAgfTtcclxuXHJcbiAgQElucHV0KCd2c0RyYWdTY3JvbGxDb25uZWN0ZWRUbycpIGRyYWdDb25uZWN0ZWRJZHM6IHN0cmluZ1tdO1xyXG4gIEBJbnB1dCgndnNEcmFnU2Nyb2xsQ29udGFpbmVyJykgc2Nyb2xsQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGNka0RyYWc6IENka0RyYWcsXHJcbiAgICBwcml2YXRlIGRyYWdEZWJ1Z1NlcnZpY2U6IERyYWdEZWJ1Z1NlcnZpY2UsXHJcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcclxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXHJcbiAgKSB7XHJcbiAgICB0aGlzLmRyYWdSZWYgPSB0aGlzLmNka0RyYWdbJ19kcmFnUmVmJ107XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ1JlZikge1xyXG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZHJhZ1JlZi5zdGFydGVkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coJ1N0YXJ0ZWQnLCBldmVudCwgdGhpcy5kcmFnUmVmLmlzRHJhZ2dpbmcoKSk7XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0ZWQoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kcmFnUmVmLmVuZGVkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2coJ0VuZGVkJywgZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5lbmRlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmRyYWdSZWYuZW50ZXJlZC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcclxuICAgICAgICAgIHRoaXMubG9nKCdFbnRlcmVkJywgZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5lbnRlcmVkKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZHJhZ1JlZi5leGl0ZWQucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShldmVudCA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZygnRXhpdGVkJywgZXZlbnQpO1xyXG4gICAgICAgICAgdGhpcy5leGl0ZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvZygnQ2RrRHJhZyBub3QgZm91bmQnLCB0aGlzLmNka0RyYWcsIHRoaXMuZHJhZ1JlZik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5kcmFnQ29ubmVjdGVkSWRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdSZWYuaXNEcmFnZ2luZygpKSB7XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyL2lzc3Vlcy8xNTM0M1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5zeW5jU2libGluZ3MoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcclxuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcclxuICAgIHRoaXMuc3RvcERyYWdnaW5nJC5uZXh0KCk7XHJcbiAgICB0aGlzLnN0b3BEcmFnZ2luZyQuY29tcGxldGUoKTtcclxuICAgIHRoaXMuZGVzdHJveUF1dG9TY3JvbGwoKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0ZWQoKSB7XHJcbiAgICBpZiAoIXRoaXMuc2Nyb2xsQ29udGFpbmVyKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlc3Ryb3lBdXRvU2Nyb2xsKCk7XHJcblxyXG4gICAgdGhpcy5hZGREZWJ1Z0luZm8oKTtcclxuXHJcbiAgICB0aGlzLmF1dG9TY3JvbGwgPSBuZXcgQXV0b1Njcm9sbCh0aGlzLnNjcm9sbENvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5sYXN0U2Nyb2xsLnRvcCA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcDtcclxuICAgIHRoaXMubGFzdFNjcm9sbC5sZWZ0ID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcclxuXHJcbiAgICBmcm9tRXZlbnQodGhpcy5zY3JvbGxDb250YWluZXIsICdzY3JvbGwnKVxyXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5zdG9wRHJhZ2dpbmckKSlcclxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVsdGFYID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdCAtIHRoaXMubGFzdFNjcm9sbC5sZWZ0O1xyXG4gICAgICAgIGNvbnN0IGRlbHRhWSA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyLnNjcm9sbFRvcCAtIHRoaXMubGFzdFNjcm9sbC50b3A7XHJcblxyXG4gICAgICAgIGlmIChkZWx0YVggfHwgZGVsdGFZKSB7XHJcbiAgICAgICAgICB0aGlzLmhhbmRsZVNjcm9sbChkZWx0YVgsIGRlbHRhWSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmxhc3RTY3JvbGwudG9wID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wO1xyXG4gICAgICAgIHRoaXMubGFzdFNjcm9sbC5sZWZ0ID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5kcmFnUmVmLm1vdmVkXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGRlYm91bmNlVGltZSgxMCksXHJcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuc3RvcERyYWdnaW5nJClcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKGUgPT4ge1xyXG4gICAgICAgIHRoaXMuYXV0b1Njcm9sbC5vbk1vdmUoZS5wb2ludGVyUG9zaXRpb24pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGVuZGVkKCkge1xyXG4gICAgdGhpcy5kZXN0cm95QXV0b1Njcm9sbCgpO1xyXG4gICAgdGhpcy5zdG9wRHJhZ2dpbmckLm5leHQoKTtcclxuICAgIHRoaXMuZHJhZ0RlYnVnU2VydmljZS5yZXNldCgpO1xyXG4gIH1cclxuXHJcbiAgZW50ZXJlZCgpIHtcclxuICAgIHRoaXMuZHJhZ0ZpeENvbnRhaW5lcigpO1xyXG4gIH1cclxuXHJcbiAgZXhpdGVkKCkge1xyXG4gICAgdGhpcy5kcmFnRml4Q29udGFpbmVyKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZVNjcm9sbCh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZHJvcExpc3RSZWY6IGFueSA9IHRoaXMuZ2V0RHJvcExpc3RSZWYoKTtcclxuXHJcbiAgICAvLyBhZGp1c3QgY29udGFpbmVyc1xyXG4gICAgdGhpcy5hZGp1c3RDb250YWluZXJzKCk7XHJcblxyXG4gICAgLy8gYWRqdXN0IGl0ZW1zXHJcbiAgICB0aGlzLmFkanVzdEl0ZW1zKHgsIHkpO1xyXG5cclxuICAgIC8vIFRvRG86IGJldHRlciBjb25kaXRpb24gZm9yIGNoYW5nZWQgaXRlbXNcclxuICAgIGlmIChkcm9wTGlzdFJlZi5fZHJhZ2dhYmxlcy5sZW5ndGggPiBkcm9wTGlzdFJlZi5faXRlbVBvc2l0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zeW5jSXRlbXMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFkZERlYnVnSW5mbygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZXN0cm95QXV0b1Njcm9sbCgpIHtcclxuICAgIGlmICh0aGlzLmF1dG9TY3JvbGwpIHtcclxuICAgICAgdGhpcy5hdXRvU2Nyb2xsLmRlc3Ryb3koKTtcclxuICAgICAgdGhpcy5hdXRvU2Nyb2xsID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RHJvcExpc3RSZWYoKTogRHJvcExpc3RSZWYge1xyXG4gICAgcmV0dXJuIHRoaXMuZHJhZ1JlZlsnX2Ryb3BDb250YWluZXInXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkRGVidWdJbmZvKCkge1xyXG4gICAgaWYgKCF0aGlzLmRyYWdEZWJ1Z1NlcnZpY2UuZW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkcm9wTGlzdFJlZjogYW55ID0gdGhpcy5nZXREcm9wTGlzdFJlZigpO1xyXG4gICAgY29uc3QgZHJhd3MgPSBbXHJcbiAgICAgIC4uLmRyb3BMaXN0UmVmLl9pdGVtUG9zaXRpb25zLm1hcChpdCA9PiAoe1xyXG4gICAgICAgIGNsaWVudFJlY3Q6IGl0LmNsaWVudFJlY3QsXHJcbiAgICAgICAgY29sb3I6ICdibHVlJyxcclxuICAgICAgICBpZDogaXQuZHJhZy5kYXRhLmRhdGEubmFtZVxyXG4gICAgICB9KSksXHJcbiAgICAgIC4uLmRyb3BMaXN0UmVmLl9zaWJsaW5ncy5tYXAoaXQgPT4gKHtcclxuICAgICAgICBjbGllbnRSZWN0OiBpdC5fY2xpZW50UmVjdCxcclxuICAgICAgICBjb2xvcjogJ2dyZWVuJyxcclxuICAgICAgICBpZDogJydcclxuICAgICAgfSkpLFxyXG4gICAgICB7XHJcbiAgICAgICAgY2xpZW50UmVjdDogZHJvcExpc3RSZWYuX2NsaWVudFJlY3QsXHJcbiAgICAgICAgY29sb3I6ICcjMkZEMUJCJyxcclxuICAgICAgICBpZDogJydcclxuICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLmRyYWdEZWJ1Z1NlcnZpY2UubG9nKGRyYXdzLmZpbHRlcihkID0+IGQuY2xpZW50UmVjdCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmFnRml4Q29udGFpbmVyKCkge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyL2lzc3Vlcy8xNTIyN1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGRyb3BMaXN0UmVmOiBhbnkgPSB0aGlzLmdldERyb3BMaXN0UmVmKCk7XHJcbiAgICAgIGRyb3BMaXN0UmVmLl9jYWNoZUl0ZW1Qb3NpdGlvbnMoKTtcclxuICAgICAgdGhpcy5hZGREZWJ1Z0luZm8oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGZpeCBmb3IgaXNzdWUgd2hlbiBjbGFzc2VzIGlzIG5vdCByZXNldHRlZFxyXG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3luY1NpYmxpbmdzKCkge1xyXG4gICAgY29uc3QgZHJvcExpc3RSZWY6IGFueSA9IHRoaXMuZ2V0RHJvcExpc3RSZWYoKTtcclxuICAgIHRoaXMubG9nKCdzeW5jU2libGluZ3MgYmVmb3JlJywgZHJvcExpc3RSZWYuX3NpYmxpbmdzLmxlbmd0aCk7XHJcbiAgICBkcm9wTGlzdFJlZi5iZWZvcmVTdGFydGVkLm5leHQoKTtcclxuICAgIHRoaXMubG9nKCdzeW5jU2libGluZ3MgYWZ0ZXInLCBkcm9wTGlzdFJlZi5fc2libGluZ3MubGVuZ3RoKTtcclxuICAgIHRoaXMuYWRqdXN0Q29udGFpbmVycygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzeW5jSXRlbXMoKSB7XHJcbiAgICBjb25zdCBkcm9wTGlzdFJlZjogYW55ID0gdGhpcy5nZXREcm9wTGlzdFJlZigpO1xyXG5cclxuICAgIGNvbnN0IG9sZFBvc2l0aW9ucyA9IGRyb3BMaXN0UmVmLl9pdGVtUG9zaXRpb25zO1xyXG4gICAgZHJvcExpc3RSZWYuX2FjdGl2ZURyYWdnYWJsZXMgPSBkcm9wTGlzdFJlZi5fZHJhZ2dhYmxlcy5zbGljZSgpO1xyXG5cclxuICAgIGRyb3BMaXN0UmVmLl9jYWNoZUl0ZW1Qb3NpdGlvbnMoKTtcclxuICAgIGNvbnN0IG5ld1Bvc2l0aW9ucyA9IGRyb3BMaXN0UmVmLl9pdGVtUG9zaXRpb25zO1xyXG4gICAgZHJvcExpc3RSZWYuX2l0ZW1Qb3NpdGlvbnMgPSBbLi4ub2xkUG9zaXRpb25zXTtcclxuICAgIG5ld1Bvc2l0aW9ucy5mb3JFYWNoKHAgPT4ge1xyXG4gICAgICBpZiAoIW9sZFBvc2l0aW9ucy5maW5kKHAxID0+IHAuZHJhZyA9PT0gcDEuZHJhZykpIHtcclxuICAgICAgICBkcm9wTGlzdFJlZi5faXRlbVBvc2l0aW9ucy5wdXNoKHApO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGRyb3BMaXN0UmVmLl9hY3RpdmVEcmFnZ2FibGVzLnB1c2godGhpcy5kcmFnUmVmKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRqdXN0Q29udGFpbmVycygpIHtcclxuICAgIGNvbnN0IGRyb3BMaXN0UmVmOiBhbnkgPSB0aGlzLmdldERyb3BMaXN0UmVmKCk7XHJcbiAgICBkcm9wTGlzdFJlZi5fY2FjaGVJdGVtUG9zaXRpb25zKCk7XHJcbiAgICAvLyBkcm9wTGlzdFJlZi5fc2libGluZ3MuZm9yRWFjaChzaWJsaW5nID0+IHtcclxuICAgICAgLy8gc2libGluZy5fY2FjaGVPd25Qb3NpdGlvbigpO1xyXG4gICAgLy8gfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkanVzdEl0ZW1zKGRlbHRhWDogbnVtYmVyLCBkZWx0YVk6IG51bWJlcikge1xyXG4gICAgY29uc3QgZHJvcExpc3RSZWY6IGFueSA9IHRoaXMuZ2V0RHJvcExpc3RSZWYoKTtcclxuICAgIGRyb3BMaXN0UmVmLl9pdGVtUG9zaXRpb25zLmZvckVhY2goaXQgPT4ge1xyXG4gICAgICBpdC5vcmlnaW5hbFJlY3QgPSBpdC5vcmlnaW5hbFJlY3QgfHwgaXQuY2xpZW50UmVjdDtcclxuICAgICAgaXQuY2xpZW50UmVjdCA9IHtcclxuICAgICAgICAuLi5pdC5jbGllbnRSZWN0LFxyXG4gICAgICAgIGxlZnQ6IGl0LmNsaWVudFJlY3QubGVmdCAtIGRlbHRhWCxcclxuICAgICAgICByaWdodDogaXQuY2xpZW50UmVjdC5yaWdodCAtIGRlbHRhWCxcclxuICAgICAgICB0b3A6IGl0LmNsaWVudFJlY3QudG9wIC0gZGVsdGFZLFxyXG4gICAgICAgIGJvdHRvbTogaXQuY2xpZW50UmVjdC5ib3R0b20gLSBkZWx0YVlcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2cobWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSB7XHJcbiAgICBpZiAodGhpcy5kcmFnRGVidWdTZXJ2aWNlLmVuYWJsZWQpIHtcclxuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSwgb3B0aW9uYWxQYXJhbXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=