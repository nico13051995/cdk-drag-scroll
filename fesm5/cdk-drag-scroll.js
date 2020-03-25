import { __spread, __assign } from 'tslib';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { ɵɵdefineInjectable, ɵsetClassMetadata, Injectable, ɵɵdirectiveInject, NgZone, ChangeDetectorRef, ɵɵdefineDirective, ɵɵNgOnChangesFeature, Directive, Input, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

var AutoScroll = /** @class */ (function () {
    function AutoScroll(container, scrollCallback) {
        this.container = container;
        this.scrollCallback = scrollCallback;
        this.margin = 30;
        this.maxSpeed = 25;
        this.point = { x: 0, y: 0 };
        this.boundaryRect = this.container.getBoundingClientRect();
    }
    AutoScroll.prototype.onMove = function (point) {
        var _this = this;
        this.point = point;
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(function () { return _this.scrollTick(); });
    };
    AutoScroll.prototype.scrollTick = function () {
        var _this = this;
        cancelAnimationFrame(this.animationFrame);
        if (this.autoScroll()) {
            this.animationFrame = requestAnimationFrame(function () { return _this.scrollTick(); });
        }
    };
    AutoScroll.prototype.autoScroll = function () {
        var _this = this;
        var scrollx, scrolly;
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
        setTimeout(function () {
            if (scrolly) {
                _this.scrollY(scrolly);
            }
            if (scrollx) {
                _this.scrollX(scrollx);
            }
        });
        return scrollx || scrolly;
    };
    AutoScroll.prototype.scrollY = function (amount) {
        // ToDo for window: window.scrollTo(window.pageXOffset, window.pageYOffset + amount);
        this.container.scrollTop += amount;
        if (this.scrollCallback) {
            this.scrollCallback({ x: 0, y: amount });
        }
    };
    AutoScroll.prototype.scrollX = function (amount) {
        // ToDo for window: window.scrollTo(window.pageXOffset + amount, window.pageYOffset);
        this.container.scrollLeft += amount;
        if (this.scrollCallback) {
            this.scrollCallback({
                x: amount,
                y: 0
            });
        }
    };
    AutoScroll.prototype.destroy = function () {
        cancelAnimationFrame(this.animationFrame);
    };
    return AutoScroll;
}());

var DragDebugService = /** @class */ (function () {
    function DragDebugService() {
        this.debugInfo = new BehaviorSubject(null);
        this.enabled = false;
    }
    DragDebugService.prototype.log = function (info) {
        this.debugInfo.next(info);
    };
    DragDebugService.prototype.reset = function () {
        this.debugInfo.next(null);
    };
    DragDebugService.ɵfac = function DragDebugService_Factory(t) { return new (t || DragDebugService)(); };
    DragDebugService.ɵprov = ɵɵdefineInjectable({ token: DragDebugService, factory: DragDebugService.ɵfac, providedIn: 'root' });
    return DragDebugService;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(DragDebugService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();

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
    DragScrollDirective.ɵfac = function DragScrollDirective_Factory(t) { return new (t || DragScrollDirective)(ɵɵdirectiveInject(CdkDrag), ɵɵdirectiveInject(DragDebugService), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(ChangeDetectorRef)); };
    DragScrollDirective.ɵdir = ɵɵdefineDirective({ type: DragScrollDirective, selectors: [["", "vsDragScroll", ""]], inputs: { dragConnectedIds: ["vsDragScrollConnectedTo", "dragConnectedIds"], scrollContainer: ["vsDragScrollContainer", "scrollContainer"] }, exportAs: ["vsDragScroll"], features: [ɵɵNgOnChangesFeature] });
    return DragScrollDirective;
}());
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

var DragScrollModule = /** @class */ (function () {
    function DragScrollModule() {
    }
    DragScrollModule.ɵmod = ɵɵdefineNgModule({ type: DragScrollModule });
    DragScrollModule.ɵinj = ɵɵdefineInjector({ factory: function DragScrollModule_Factory(t) { return new (t || DragScrollModule)(); }, imports: [[DragDropModule]] });
    return DragScrollModule;
}());
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
