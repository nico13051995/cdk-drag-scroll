import { NgModule } from '@angular/core';
import { DragScrollDirective } from './drag-scroll.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import * as i0 from "@angular/core";
export class DragScrollModule {
}
DragScrollModule.ɵmod = i0.ɵɵdefineNgModule({ type: DragScrollModule });
DragScrollModule.ɵinj = i0.ɵɵdefineInjector({ factory: function DragScrollModule_Factory(t) { return new (t || DragScrollModule)(); }, imports: [[DragDropModule]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(DragScrollModule, { declarations: [DragScrollDirective], imports: [DragDropModule], exports: [DragScrollDirective] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DragScrollModule, [{
        type: NgModule,
        args: [{
                imports: [DragDropModule],
                declarations: [DragScrollDirective],
                exports: [DragScrollDirective]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1zY3JvbGwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vY2RrLWRyYWctc2Nyb2xsLyIsInNvdXJjZXMiOlsibGliL2RyYWctc2Nyb2xsLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFPeEQsTUFBTSxPQUFPLGdCQUFnQjs7b0RBQWhCLGdCQUFnQjsrR0FBaEIsZ0JBQWdCLGtCQUpsQixDQUFDLGNBQWMsQ0FBQzt3RkFJZCxnQkFBZ0IsbUJBSFosbUJBQW1CLGFBRHhCLGNBQWMsYUFFZCxtQkFBbUI7a0RBRWxCLGdCQUFnQjtjQUw1QixRQUFRO2VBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUN6QixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgRHJhZ1Njcm9sbERpcmVjdGl2ZSB9IGZyb20gJy4vZHJhZy1zY3JvbGwuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW0RyYWdEcm9wTW9kdWxlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtEcmFnU2Nyb2xsRGlyZWN0aXZlXSxcclxuICBleHBvcnRzOiBbRHJhZ1Njcm9sbERpcmVjdGl2ZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIERyYWdTY3JvbGxNb2R1bGUge31cclxuIl19