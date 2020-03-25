import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdirectiveInject, NgZone, ChangeDetectorRef, ɵɵdefineDirective, ɵɵNgOnChangesFeature, Directive, Input, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

class AutoScroll {
    constructor(container, scrollCallback) {
        this.container = container;
        this.scrollCallback = scrollCallback;
        this.margin = 30;
        this.maxSpeed = 25;
        this.point = { x: 0, y: 0 };
        this.boundaryRect = this.container.getBoundingClientRect();
    }
    onMove(point) {
        this.point = point;
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(() => this.scrollTick());
    }
    scrollTick() {
        cancelAnimationFrame(this.animationFrame);
        if (this.autoScroll()) {
            this.animationFrame = requestAnimationFrame(() => this.scrollTick());
        }
    }
    autoScroll() {
        let scrollx, scrolly;
        if (this.point.x < this.boundaryRect.left + this.margin) {
            scrollx = Math.floor(Math.max(-1, (this.point.x - this.boundaryRect.left) / this.margin - 1) * this.maxSpeed);
        }
        else if (this.point.x > this.boundaryRect.right - this.margin) {
            scrollx = Math.ceil(Math.min(1, (this.point.x - this.boundaryRect.right) / this.margin + 1) * this.maxSpeed);
        }
        else {
            scrollx = 0;
        }
        if (this.point.y < this.boundaryRect.top + this.margin) {
            scrolly = Math.floor(Math.max(-1, (this.point.y - this.boundaryRect.top) / this.margin - 1) *
                this.maxSpeed);
        }
        else if (this.point.y > this.boundaryRect.bottom - this.margin) {
            scrolly = Math.ceil(Math.min(1, (this.point.y - this.boundaryRect.bottom) / this.margin + 1) * this.maxSpeed);
        }
        else {
            scrolly = 0;
        }
        setTimeout(() => {
            if (scrolly) {
                this.scrollY(scrolly);
            }
            if (scrollx) {
                this.scrollX(scrollx);
            }
        });
        return scrollx || scrolly;
    }
    scrollY(amount) {
        // ToDo for window: window.scrollTo(window.pageXOffset, window.pageYOffset + amount);
        this.container.scrollTop += amount;
        if (this.scrollCallback) {
            this.scrollCallback({ x: 0, y: amount });
        }
    }
    scrollX(amount) {
        // ToDo for window: window.scrollTo(window.pageXOffset + amount, window.pageYOffset);
        this.container.scrollLeft += amount;
        if (this.scrollCallback) {
            this.scrollCallback({
                x: amount,
                y: 0
            });
        }
    }
    destroy() {
        cancelAnimationFrame(this.animationFrame);
    }
}

class DragDebugService {
    constructor() {
        this.debugInfo = new BehaviorSubject(null);
        this.enabled = false;
    }
    log(info) {
        this.debugInfo.next(info);
    }
    reset() {
        this.debugInfo.next(null);
    }
}
DragDebugService.ɵfac = function DragDebugService_Factory(t) { return new (t || DragDebugService)(); };
DragDebugService.ɵprov = ɵɵdefineInjectable({ token: DragDebugService, factory: DragDebugService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DragDebugService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();

class DragScrollDirective {
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
            dropListRef._cacheItemPositions();
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
        dropListRef._cacheItemPositions();
        // dropListRef._siblings.forEach(sibling => {
        // sibling._cacheOwnPosition();
        // });
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
DragScrollDirective.ɵfac = function DragScrollDirective_Factory(t) { return new (t || DragScrollDirective)(ɵɵdirectiveInject(CdkDrag), ɵɵdirectiveInject(DragDebugService), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(ChangeDetectorRef)); };
DragScrollDirective.ɵdir = ɵɵdefineDirective({ type: DragScrollDirective, selectors: [["", "vsDragScroll", ""]], inputs: { dragConnectedIds: ["vsDragScrollConnectedTo", "dragConnectedIds"], scrollContainer: ["vsDragScrollContainer", "scrollContainer"] }, exportAs: ["vsDragScroll"], features: [ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DragScrollDirective, [{
        type: Directive,
        args: [{
                selector: '[vsDragScroll]',
                exportAs: 'vsDragScroll'
            }]
    }], function () { return [{ type: CdkDrag }, { type: DragDebugService }, { type: NgZone }, { type: ChangeDetectorRef }]; }, { dragConnectedIds: [{
            type: Input,
            args: ['vsDragScrollConnectedTo']
        }], scrollContainer: [{
            type: Input,
            args: ['vsDragScrollContainer']
        }] }); })();

class DragScrollModule {
}
DragScrollModule.ɵmod = ɵɵdefineNgModule({ type: DragScrollModule });
DragScrollModule.ɵinj = ɵɵdefineInjector({ factory: function DragScrollModule_Factory(t) { return new (t || DragScrollModule)(); }, imports: [[DragDropModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(DragScrollModule, { declarations: [DragScrollDirective], imports: [DragDropModule], exports: [DragScrollDirective] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(DragScrollModule, [{
        type: NgModule,
        args: [{
                imports: [DragDropModule],
                declarations: [DragScrollDirective],
                exports: [DragScrollDirective]
            }]
    }], null, null); })();

/**
 * Generated bundle index. Do not edit.
 */

export { AutoScroll, DragDebugService, DragScrollDirective, DragScrollModule };
//# sourceMappingURL=cdk-drag-scroll.js.map
