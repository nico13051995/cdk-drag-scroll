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
export { AutoScroll };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1zY3JvbGwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jZGstZHJhZy1zY3JvbGwvIiwic291cmNlcyI6WyJsaWIvYXV0by1zY3JvbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7SUFPRSxvQkFDVSxTQUFzQixFQUN0QixjQUErQjtRQUQvQixjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQ3RCLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtRQVJ6QyxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ1osYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUdkLFVBQUssR0FBNkIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQU0vQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0lBRUQsMkJBQU0sR0FBTixVQUFPLEtBQStCO1FBQXRDLGlCQUlDO1FBSEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxVQUFVLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCwrQkFBVSxHQUFWO1FBQUEsaUJBS0M7UUFKQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7U0FDdEU7SUFDSCxDQUFDO0lBRUQsK0JBQVUsR0FBVjtRQUFBLGlCQWdEQztRQS9DQyxJQUFJLE9BQU8sRUFBRSxPQUFPLENBQUM7UUFF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QUFJLENBQUMsY0FBYyxDQUFDO2dCQUNsQixDQUFDLEVBQUUsTUFBTTtnQkFDVCxDQUFDLEVBQUUsQ0FBQzthQUNMLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELDRCQUFPLEdBQVA7UUFDRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQW5HRCxJQW1HQyIsInNvdXJjZXNDb250ZW50IjpbInR5cGUgU2Nyb2xsQ2FsbGJhY2sgPSAoZXZlbnQ6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4gdm9pZDtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdXRvU2Nyb2xsIHtcclxuICBtYXJnaW4gPSAzMDtcclxuICBtYXhTcGVlZCA9IDI1O1xyXG4gIGFuaW1hdGlvbkZyYW1lOiBhbnk7XHJcbiAgYm91bmRhcnlSZWN0OiBDbGllbnRSZWN0O1xyXG4gIHBvaW50OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPSB7IHg6IDAsIHk6IDAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsXHJcbiAgICBwcml2YXRlIHNjcm9sbENhbGxiYWNrPzogU2Nyb2xsQ2FsbGJhY2tcclxuICApIHtcclxuICAgIHRoaXMuYm91bmRhcnlSZWN0ID0gdGhpcy5jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgfVxyXG5cclxuICBvbk1vdmUocG9pbnQ6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkge1xyXG4gICAgdGhpcy5wb2ludCA9IHBvaW50O1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XHJcbiAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuc2Nyb2xsVGljaygpKTtcclxuICB9XHJcblxyXG4gIHNjcm9sbFRpY2soKSB7XHJcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcclxuICAgIGlmICh0aGlzLmF1dG9TY3JvbGwoKSkge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuc2Nyb2xsVGljaygpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGF1dG9TY3JvbGwoKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgc2Nyb2xseCwgc2Nyb2xseTtcclxuXHJcbiAgICBpZiAodGhpcy5wb2ludC54IDwgdGhpcy5ib3VuZGFyeVJlY3QubGVmdCArIHRoaXMubWFyZ2luKSB7XHJcbiAgICAgIHNjcm9sbHggPSBNYXRoLmZsb29yKFxyXG4gICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgLTEsXHJcbiAgICAgICAgICAodGhpcy5wb2ludC54IC0gdGhpcy5ib3VuZGFyeVJlY3QubGVmdCkgLyB0aGlzLm1hcmdpbiAtIDFcclxuICAgICAgICApICogdGhpcy5tYXhTcGVlZFxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnBvaW50LnggPiB0aGlzLmJvdW5kYXJ5UmVjdC5yaWdodCAtIHRoaXMubWFyZ2luKSB7XHJcbiAgICAgIHNjcm9sbHggPSBNYXRoLmNlaWwoXHJcbiAgICAgICAgTWF0aC5taW4oXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgKHRoaXMucG9pbnQueCAtIHRoaXMuYm91bmRhcnlSZWN0LnJpZ2h0KSAvIHRoaXMubWFyZ2luICsgMVxyXG4gICAgICAgICkgKiB0aGlzLm1heFNwZWVkXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzY3JvbGx4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5wb2ludC55IDwgdGhpcy5ib3VuZGFyeVJlY3QudG9wICsgdGhpcy5tYXJnaW4pIHtcclxuICAgICAgc2Nyb2xseSA9IE1hdGguZmxvb3IoXHJcbiAgICAgICAgTWF0aC5tYXgoLTEsICh0aGlzLnBvaW50LnkgLSB0aGlzLmJvdW5kYXJ5UmVjdC50b3ApIC8gdGhpcy5tYXJnaW4gLSAxKSAqXHJcbiAgICAgICAgICB0aGlzLm1heFNwZWVkXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9pbnQueSA+IHRoaXMuYm91bmRhcnlSZWN0LmJvdHRvbSAtIHRoaXMubWFyZ2luKSB7XHJcbiAgICAgIHNjcm9sbHkgPSBNYXRoLmNlaWwoXHJcbiAgICAgICAgTWF0aC5taW4oXHJcbiAgICAgICAgICAxLFxyXG4gICAgICAgICAgKHRoaXMucG9pbnQueSAtIHRoaXMuYm91bmRhcnlSZWN0LmJvdHRvbSkgLyB0aGlzLm1hcmdpbiArIDFcclxuICAgICAgICApICogdGhpcy5tYXhTcGVlZFxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2Nyb2xseSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmIChzY3JvbGx5KSB7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxZKHNjcm9sbHkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2Nyb2xseCkge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsWChzY3JvbGx4KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHNjcm9sbHggfHwgc2Nyb2xseTtcclxuICB9XHJcblxyXG4gIHNjcm9sbFkoYW1vdW50OiBudW1iZXIpIHtcclxuICAgIC8vIFRvRG8gZm9yIHdpbmRvdzogd2luZG93LnNjcm9sbFRvKHdpbmRvdy5wYWdlWE9mZnNldCwgd2luZG93LnBhZ2VZT2Zmc2V0ICsgYW1vdW50KTtcclxuICAgIHRoaXMuY29udGFpbmVyLnNjcm9sbFRvcCArPSBhbW91bnQ7XHJcbiAgICBpZiAodGhpcy5zY3JvbGxDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLnNjcm9sbENhbGxiYWNrKHsgeDogMCwgeTogYW1vdW50IH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2Nyb2xsWChhbW91bnQpIHtcclxuICAgIC8vIFRvRG8gZm9yIHdpbmRvdzogd2luZG93LnNjcm9sbFRvKHdpbmRvdy5wYWdlWE9mZnNldCArIGFtb3VudCwgd2luZG93LnBhZ2VZT2Zmc2V0KTtcclxuICAgIHRoaXMuY29udGFpbmVyLnNjcm9sbExlZnQgKz0gYW1vdW50O1xyXG4gICAgaWYgKHRoaXMuc2Nyb2xsQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5zY3JvbGxDYWxsYmFjayh7XHJcbiAgICAgICAgeDogYW1vdW50LFxyXG4gICAgICAgIHk6IDBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==