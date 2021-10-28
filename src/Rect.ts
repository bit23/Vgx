
namespace Vgx {

	function createEmptyRect() {
		return new Rect(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
	}

	function createInvalidRect() {
		return new Rect(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
	}

	function unite(baseRect: Rect, otherRect: Rect) {
		if (!Rect.isEmpty(otherRect)) {
			let left = Math.min(baseRect.x, otherRect.x);
			let top = Math.min(baseRect.y, otherRect.y);
			if ((otherRect.width == Number.POSITIVE_INFINITY) || (baseRect.width == Number.POSITIVE_INFINITY)) {
				baseRect.width = Number.POSITIVE_INFINITY;
			}
			else {
				let right;
				if (baseRect.width == Number.NEGATIVE_INFINITY || baseRect.x == Number.POSITIVE_INFINITY) {
					right = otherRect.x + otherRect.width;
				}
				else {
					right = Math.max(baseRect.x + baseRect.width, otherRect.x + otherRect.width);
				}
				baseRect.width = Math.max(right - left, 0.0);
			}
			if ((otherRect.height == Number.POSITIVE_INFINITY) || (baseRect.height == Number.POSITIVE_INFINITY)) {
				baseRect.height = Number.POSITIVE_INFINITY;
			}
			else {
				let bottom;
				if (baseRect.height == Number.NEGATIVE_INFINITY || baseRect.y == Number.POSITIVE_INFINITY) {
					bottom = otherRect.y + otherRect.height;
				}
				else {
					bottom = Math.max(baseRect.y + baseRect.height, otherRect.y + otherRect.height);
				}
				baseRect.height = Math.max(bottom - top, 0.0);
			}
			baseRect.x = left;
			baseRect.y = top;
		}
	} 

	export class Rect {

		public static readonly empty = createEmptyRect();

		public static readonly invalid = createInvalidRect();

		public static isEmpty(rect: Rect) {
			if (!Number.isFinite(rect.x) || !Number.isFinite(rect.y))
                    return true;
                return rect.width <= 0 && rect.height <= 0;
		}

		public static equals(rect1: Rect, rect2: Rect) {
			if (rect1 == null && rect2 == null) return true;
			if (rect1 == null) return false;
			if (rect2 == null) return false;
			if (rect1.x != rect2.x) return false;
			if (rect1.y != rect2.y) return false;
			if (rect1.width != rect2.width) return false;
			if (rect1.height != rect2.height) return false;
			return true;
		}


		public static from(values: {
            x: number;
            y: number;
            width: number;
            height: number;
        }) {
			return new Rect(values.x, values.y, values.width, values.height);
		}

		constructor(x?: number, y?: number, width?: number, height?: number) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		} 

		public x: number;
		public y: number;
		public width: number;
		public height: number;

		public union(rect: Rect) {
			unite(this, rect);
		}
	}
}