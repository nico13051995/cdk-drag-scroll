import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class DragDebugService {
    debugInfo: BehaviorSubject<any[]>;
    enabled: boolean;
    constructor();
    log(info: any[]): void;
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDef<DragDebugService, never>;
    static ɵprov: i0.ɵɵInjectableDef<DragDebugService>;
}
