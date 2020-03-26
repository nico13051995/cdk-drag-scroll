(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/drag-drop'), require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('cdk-drag-scroll', ['exports', '@angular/cdk/drag-drop', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['cdk-drag-scroll'] = {}, global.ng.cdk.dragDrop, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, (function (exports, dragDrop, core, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

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
            this.debugInfo = new rxjs.BehaviorSubject(null);
            this.enabled = false;
        }
        DragDebugService.prototype.log = function (info) {
            this.debugInfo.next(info);
        };
        DragDebugService.prototype.reset = function () {
            this.debugInfo.next(null);
        };
        DragDebugService.ɵfac = function DragDebugService_Factory(t) { return new (t || DragDebugService)(); };
        DragDebugService.ɵprov = core["ɵɵdefineInjectable"]({ token: DragDebugService, factory: DragDebugService.ɵfac, providedIn: 'root' });
        return DragDebugService;
    }());
    /*@__PURE__*/ (function () { core["ɵsetClassMetadata"](DragDebugService, [{
            type: core.Injectable,
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
            this.destroy$ = new rxjs.Subject();
            this.stopDragging$ = new rxjs.Subject();
            this.lastScroll = {
                top: 0,
                left: 0
            };
            this.dragRef = this.cdkDrag['_dragRef'];
            if (this.dragRef) {
                this.zone.runOutsideAngular(function () {
                    _this.dragRef.started.pipe(operators.takeUntil(_this.destroy$)).subscribe(function (event) {
                        _this.log('Started', event, _this.dragRef.isDragging());
                        _this.started();
                    });
                    _this.dragRef.ended.pipe(operators.takeUntil(_this.destroy$)).subscribe(function (event) {
                        _this.log('Ended', event);
                        _this.ended();
                    });
                    _this.dragRef.entered.pipe(operators.takeUntil(_this.destroy$)).subscribe(function (event) {
                        _this.log('Entered', event);
                        _this.entered();
                    });
                    _this.dragRef.exited.pipe(operators.takeUntil(_this.destroy$)).subscribe(function (event) {
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
            rxjs.fromEvent(this.scrollContainer, 'scroll')
                .pipe(operators.takeUntil(this.stopDragging$))
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
                .pipe(operators.debounceTime(10), operators.takeUntil(this.stopDragging$))
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
                dropListRef._cacheParentPositions();
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
            dropListRef._cacheParentPositions();
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
        DragScrollDirective.ɵfac = function DragScrollDirective_Factory(t) { return new (t || DragScrollDirective)(core["ɵɵdirectiveInject"](dragDrop.CdkDrag), core["ɵɵdirectiveInject"](DragDebugService), core["ɵɵdirectiveInject"](core.NgZone), core["ɵɵdirectiveInject"](core.ChangeDetectorRef)); };
        DragScrollDirective.ɵdir = core["ɵɵdefineDirective"]({ type: DragScrollDirective, selectors: [["", "vsDragScroll", ""]], inputs: { dragConnectedIds: ["vsDragScrollConnectedTo", "dragConnectedIds"], scrollContainer: ["vsDragScrollContainer", "scrollContainer"] }, exportAs: ["vsDragScroll"], features: [core["ɵɵNgOnChangesFeature"]] });
        return DragScrollDirective;
    }());
    /*@__PURE__*/ (function () { core["ɵsetClassMetadata"](DragScrollDirective, [{
            type: core.Directive,
            args: [{
                    selector: '[vsDragScroll]',
                    exportAs: 'vsDragScroll'
                }]
        }], function () { return [{ type: dragDrop.CdkDrag }, { type: DragDebugService }, { type: core.NgZone }, { type: core.ChangeDetectorRef }]; }, { dragConnectedIds: [{
                type: core.Input,
                args: ['vsDragScrollConnectedTo']
            }], scrollContainer: [{
                type: core.Input,
                args: ['vsDragScrollContainer']
            }] }); })();

    var DragScrollModule = /** @class */ (function () {
        function DragScrollModule() {
        }
        DragScrollModule.ɵmod = core["ɵɵdefineNgModule"]({ type: DragScrollModule });
        DragScrollModule.ɵinj = core["ɵɵdefineInjector"]({ factory: function DragScrollModule_Factory(t) { return new (t || DragScrollModule)(); }, imports: [[dragDrop.DragDropModule]] });
        return DragScrollModule;
    }());
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && core["ɵɵsetNgModuleScope"](DragScrollModule, { declarations: [DragScrollDirective], imports: [dragDrop.DragDropModule], exports: [DragScrollDirective] }); })();
    /*@__PURE__*/ (function () { core["ɵsetClassMetadata"](DragScrollModule, [{
            type: core.NgModule,
            args: [{
                    imports: [dragDrop.DragDropModule],
                    declarations: [DragScrollDirective],
                    exports: [DragScrollDirective]
                }]
        }], null, null); })();

    exports.AutoScroll = AutoScroll;
    exports.DragDebugService = DragDebugService;
    exports.DragScrollDirective = DragScrollDirective;
    exports.DragScrollModule = DragScrollModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cdk-drag-scroll.umd.js.map
