import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
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
    DragDebugService.ɵprov = i0.ɵɵdefineInjectable({ token: DragDebugService, factory: DragDebugService.ɵfac, providedIn: 'root' });
    return DragDebugService;
}());
export { DragDebugService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DragDebugService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1kZWJ1Zy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2RrLWRyYWctc2Nyb2xsLyIsInNvdXJjZXMiOlsibGliL2RyYWctZGVidWcuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBRW5EO0lBT0U7UUFIQSxjQUFTLEdBQUcsSUFBSSxlQUFlLENBQVEsSUFBSSxDQUFDLENBQUM7UUFDN0MsWUFBTyxHQUFHLEtBQUssQ0FBQztJQUVELENBQUM7SUFFaEIsOEJBQUcsR0FBSCxVQUFJLElBQVc7UUFDYixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsZ0NBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7b0ZBWlUsZ0JBQWdCOzREQUFoQixnQkFBZ0IsV0FBaEIsZ0JBQWdCLG1CQUZmLE1BQU07MkJBSnBCO0NBbUJDLEFBaEJELElBZ0JDO1NBYlksZ0JBQWdCO2tEQUFoQixnQkFBZ0I7Y0FINUIsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIERyYWdEZWJ1Z1NlcnZpY2Uge1xyXG4gIGRlYnVnSW5mbyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55W10+KG51bGwpO1xyXG4gIGVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICBsb2coaW5mbzogYW55W10pIHtcclxuICAgIHRoaXMuZGVidWdJbmZvLm5leHQoaW5mbyk7XHJcbiAgfVxyXG5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMuZGVidWdJbmZvLm5leHQobnVsbCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==