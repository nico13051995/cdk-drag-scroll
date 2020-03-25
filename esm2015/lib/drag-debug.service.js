import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class DragDebugService {
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
DragDebugService.ɵprov = i0.ɵɵdefineInjectable({ token: DragDebugService, factory: DragDebugService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DragDebugService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1kZWJ1Zy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2RrLWRyYWctc2Nyb2xsLyIsInNvdXJjZXMiOlsibGliL2RyYWctZGVidWcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBS25ELE1BQU0sT0FBTyxnQkFBZ0I7SUFJM0I7UUFIQSxjQUFTLEdBQUcsSUFBSSxlQUFlLENBQVEsSUFBSSxDQUFDLENBQUM7UUFDN0MsWUFBTyxHQUFHLEtBQUssQ0FBQztJQUVELENBQUM7SUFFaEIsR0FBRyxDQUFDLElBQVc7UUFDYixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7O2dGQVpVLGdCQUFnQjt3REFBaEIsZ0JBQWdCLFdBQWhCLGdCQUFnQixtQkFGZixNQUFNO2tEQUVQLGdCQUFnQjtjQUg1QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRHJhZ0RlYnVnU2VydmljZSB7XHJcbiAgZGVidWdJbmZvID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnlbXT4obnVsbCk7XHJcbiAgZW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIGxvZyhpbmZvOiBhbnlbXSkge1xyXG4gICAgdGhpcy5kZWJ1Z0luZm8ubmV4dChpbmZvKTtcclxuICB9XHJcblxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5kZWJ1Z0luZm8ubmV4dChudWxsKTtcclxuICB9XHJcbn1cclxuIl19