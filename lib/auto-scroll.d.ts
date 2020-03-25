declare type ScrollCallback = (event: {
    x: number;
    y: number;
}) => void;
export declare class AutoScroll {
    private container;
    private scrollCallback?;
    margin: number;
    maxSpeed: number;
    animationFrame: any;
    boundaryRect: ClientRect;
    point: {
        x: number;
        y: number;
    };
    constructor(container: HTMLElement, scrollCallback?: ScrollCallback);
    onMove(point: {
        x: number;
        y: number;
    }): void;
    scrollTick(): void;
    autoScroll(): boolean;
    scrollY(amount: number): void;
    scrollX(amount: any): void;
    destroy(): void;
}
export {};
