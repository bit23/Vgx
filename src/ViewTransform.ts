
namespace Vgx {

	// export class VgxTransform {

	// 	private _matrix: Cgx.Matrix;
	// 	private _matrixInverted: Cgx.Matrix;
    //     private _isDirty = true;
	// 	private _originX = 0.0;
    //     private _originY = 0.0;
    //     private _translationX = 0.0;
    //     private _translationY = 0.0;
    //     private _scaleX = 1.0;
    //     private _scaleY = 1.0;
    //     private _rotation = 0.0;

	// 	constructor() {
	// 		this._matrix = new Cgx.Matrix();
	// 	}

	// 	private _computeInternalMatrix() {
	// 		this._matrix.reset();

	// 		this._matrix.translate(this._translationX, this._translationY);
	// 		this._matrix.rotate(this._rotation);
	// 		this._matrix.scale(this._scaleX, this._scaleY);

	// 		this._isDirty = false;
	// 		this._matrixInverted = null;
	// 	}

	// 	private _getMatrixInverted() {
	// 		// update matrix if dirty
	// 		this.getMatrix();

	// 		if (this._matrix.hasInverse()) {
	// 			// check inverted matrix
	// 			if (this._matrixInverted == null) {
	// 				this._matrixInverted = Cgx.Matrix.invert(this._matrix);
	// 			}
	// 			return this._matrixInverted;
	// 		}
	// 		else {
	// 			return this._matrix;
	// 		}
	// 	}


	// 	protected _propertyChanged: (propertyName: string) => void = (p) => { };


	// 	public get originX() {
    //         return this._originX;
    //     }
    //     public set originX(v: number) {
    //         if (typeof v === "number") {
    //             if (this._originX !== v) {
    //                 this._originX = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("originX");
    //             }
    //         }
    //     }

    //     public get originY() {
    //         return this._originY;
    //     }
    //     public set originY(v: number) {
    //         if (typeof v === "number") {
    //             if (this._originY !== v) {
    //                 this._originY = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("originY");
    //             }
    //         }
    //     }

    //     public get translationX() {
    //         return this._translationX;
    //     }
    //     public set translationX(v: number) {
    //         if (typeof v === "number") {
    //             if (this._translationX !== v) {
    //                 this._translationX = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("translationX");
    //             }
    //         }
    //     }

    //     public get translationY() {
    //         return this._translationY;
    //     }
    //     public set translationY(v: number) {
    //         if (typeof v === "number") {
    //             if (this._translationY !== v) {
    //                 this._translationY = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("translationY");
    //             }
    //         }
    //     }

    //     public get scaleX() {
    //         return this._scaleX;
    //     }
    //     public set scaleX(v: number) {
    //         if (typeof v === "number") {
    //             if (this._scaleX !== v) {
    //                 this._scaleX = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("scaleX");
    //             }
    //         }
    //     }

    //     public get scaleY() {
    //         return this._scaleY;
    //     }
    //     public set scaleY(v: number) {
    //         if (typeof v === "number") {
    //             if (this._scaleY !== v) {
    //                 this._scaleY = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("scaleY");
    //             }
    //         }
    //     }

    //     public get rotation() {
    //         return this._rotation;
    //     }
    //     public set rotation(v: number) {
    //         if (typeof v === "number") {
    //             if (this._rotation !== v) {
    //                 this._rotation = v;
    //                 this._isDirty = true;
    //                 this._propertyChanged("rotation");
    //             }
    //         }
    //     }

    //     public get isIdentity() {
    //         if (this._translationX == 0 && this._translationY == 0) {
    //             if (this._scaleX == 1 && this._scaleY == 1) {
    //                 if (this._rotation == 0) {
    //                     return true;
    //                 }
    //             }
    //         }
    //         return false;
    //     }


	// 	public getMatrix() {
	// 		if (this._isDirty) {
	// 			this._computeInternalMatrix();
	// 		}
	// 		return this._matrix;
	// 	}

	// 	public getMatrixInverted() {
	// 		return this._getMatrixInverted();
	// 	}

	// 	public invalidate() {
	// 		this._isDirty = true;
	// 	}

	// 	public reset() {
    //         this._originX = 0.0;
    //         this._originY = 0.0;
    //         this._translationX = 0.0;
    //         this._translationY = 0.0;
    //         this._scaleX = 1.0;
    //         this._scaleY = 1.0;
    //         this._rotation = 0.0;
    //         this._matrix = null;
    //     }

	// 	public transformPoint(x: number, y: number) {
    //         return this.getMatrix().transformPoint(x, y);
    //     }

    //     public transformRect(x: number, y: number, width: number, height: number) {
    //         return this.getMatrix().transformRect(x, y, width, height);
    //     }
	// }

	// export class ViewTransform {

	// 	private _transform = new VgxTransform();

	// 	// private _matrix = new Cgx.Matrix();
	// 	// private _matrixInverted: Cgx.Matrix;
	// 	private _isDirty = true;
	// 	private _viewZoom = 1;
	// 	private _viewTargetX = 0;
	// 	private _viewTargetY = 0;
	// 	private _viewPixelWidth = 1;
	// 	private _viewPixelHeight = 1;
	// 	private _viewPixelHalfWidth = this._viewPixelWidth * 0.5;
	// 	private _viewPixelHalfHeight = this._viewPixelHeight * 0.5;


	// 	// private _computeInternalMatrix() {
	// 	// 	this._matrix.reset();

	// 	// 	this._matrix.translate(this._viewPixelHalfWidth, this._viewPixelHalfHeight);
	// 	// 	this._matrix.scale(this._viewZoom, this._viewZoom);
	// 	// 	this._matrix.translate(-this._viewTargetX, -this._viewTargetY);

	// 	// 	this._isDirty = false;
	// 	// 	this._matrixInverted = null;

	// 	// 	this._setTarget(this._viewTargetX, this._viewTargetY);
	// 	// }

	// 	// private _getMatrixInverted() {
	// 	// 	// update matrix if dirty
	// 	// 	this.getMatrix();

	// 	// 	if (this._matrix.hasInverse()) {
	// 	// 		// check inverted matrix
	// 	// 		if (this._matrixInverted == null) {
	// 	// 			this._matrixInverted = Cgx.Matrix.invert(this._matrix);
	// 	// 		}
	// 	// 		return this._matrixInverted;
	// 	// 	}
	// 	// 	else {
	// 	// 		return this._matrix;
	// 	// 	}
	// 	// }

	// 	private _setMatrixOffset(offsetX: number, offsetY: number) {
	// 		this._matrix.offsetX = offsetX;
    //         this._matrix.offsetY = offsetY;
	// 	}

	// 	private _setTarget(x: number, y: number) {
	// 		const globalViewRect = this.localToGlobalRect(0, 0, this._viewPixelWidth, this._viewPixelHeight);
    //             var offsetX = -x + (globalViewRect.width * 0.5);
    //             var offsetY = -y + (globalViewRect.height * 0.5);
    //             offsetX *= this._viewZoom;
    //             offsetY *= this._viewZoom;
    //             this._setMatrixOffset(offsetX, offsetY);
    //             this._viewTargetX = x;
    //             this._viewTargetY = y;
	// 	}



	// 	public get viewTargetX() { return this._viewTargetX; }
	// 	public get viewTargetY() { return this._viewTargetY; }
	// 	public get viewZoom() { return this._viewZoom; }


	// 	public getMatrix() {
	// 		if (this._isDirty) {
	// 			this._computeInternalMatrix();
	// 		}
	// 		return this._matrix;
	// 	}

	// 	public getViewBounds() {
	// 		return this.localToGlobalRect(0, 0, this._viewPixelWidth, this._viewPixelHeight);
	// 	}

	// 	public globalToLocalPoint(x: number, y: number) {
	// 		return this._transform.transformPoint(x, y);
	// 	}

	// 	public globalToLocalRect(x: number, y: number, width: number, height: number) {
	// 		return this._transform.transformRect(x, y, width, height);
	// 	}

	// 	public localToGlobalPoint(x: number, y: number) {
	// 		return this._getMatrixInverted().transformPoint(x, y);
	// 	}

	// 	public localToGlobalRect(x: number, y: number, width: number, height: number) {
	// 		return this._getMatrixInverted().transformRect(x, y, width, height);
	// 	}

	// 	public moveViewTarget(dx: number, dy: number) {
	// 		this._setTarget(this._viewTargetX + dx, this._viewTargetY + dy);
	// 		this._isDirty = true;
	// 	}

	// 	public setViewPixelSize(width: number, height: number) {
	// 		this._viewPixelWidth = width;
	// 		this._viewPixelHeight = height;
	// 		this._viewPixelHalfWidth = this._viewPixelWidth * 0.5;
	// 		this._viewPixelHalfHeight = this._viewPixelHeight * 0.5;
	// 		this._isDirty = true;
	// 	}

	// 	public setViewTarget(tx: number, ty: number) {
	// 		this._setTarget(tx, ty);
	// 		this._isDirty = true;
	// 	}

	// 	public setViewZoom(value: number) {
	// 		this._viewZoom = value;
	// 		this._isDirty = true;
	// 	}

	// 	public setViewZoomTo(value: number, tx: number, ty: number) {
	// 		this._setTarget(tx, ty);
	// 		this._viewZoom *= value;
	// 		this._isDirty = true;
	// 	}
	// }

	export class ViewTransform implements Cgx.ITransform {

		private _matrix = new Cgx.Matrix();
		private _matrixInverted: Cgx.Matrix;
		private _isDirty = true;
		private _viewZoom = 1;
		private _viewTargetX = 0;
		private _viewTargetY = 0;
		private _viewPixelWidth = 1;
		private _viewPixelHeight = 1;
		private _viewPixelHalfWidth = this._viewPixelWidth * 0.5;
		private _viewPixelHalfHeight = this._viewPixelHeight * 0.5;


		private _computeInternalMatrix() {
			this._matrix.reset();

			this._matrix.translate(this._viewPixelHalfWidth, this._viewPixelHalfHeight);
			this._matrix.scale(this._viewZoom, this._viewZoom);
			this._matrix.translate(-this._viewTargetX, -this._viewTargetY);

			this._isDirty = false;
			this._matrixInverted = null;

			this._setTarget(this._viewTargetX, this._viewTargetY);
		}

		private _getMatrixInverted() {
			// update matrix if dirty
			this.getMatrix();

			if (this._matrix.hasInverse()) {
				// check inverted matrix
				if (this._matrixInverted == null) {
					this._matrixInverted = Cgx.Matrix.invert(this._matrix);
				}
				return this._matrixInverted;
			}
			else {
				return this._matrix;
			}
		}

		private _setMatrixOffset(offsetX: number, offsetY: number) {
			this._matrix.offsetX = offsetX;
            this._matrix.offsetY = offsetY;
		}

		private _setTarget(x: number, y: number) {
			const globalViewRect = this.localToGlobalRect(0, 0, this._viewPixelWidth, this._viewPixelHeight);
                var offsetX = -x + (globalViewRect.width * 0.5);
                var offsetY = -y + (globalViewRect.height * 0.5);
                offsetX *= this._viewZoom;
                offsetY *= this._viewZoom;
                this._setMatrixOffset(offsetX, offsetY);
                this._viewTargetX = x;
                this._viewTargetY = y;
		}



		public get viewTargetX() { return this._viewTargetX; }
		public get viewTargetY() { return this._viewTargetY; }
		public get viewZoom() { return this._viewZoom; }


		public getMatrix() {
			if (this._isDirty) {
				this._computeInternalMatrix();
			}
			return this._matrix;
		}

		public getViewBounds() {
			return this.localToGlobalRect(0, 0, this._viewPixelWidth, this._viewPixelHeight);
		}

		public globalToLocalPoint(x: number, y: number) {
			return this.getMatrix().transformPoint(x, y);
		}

		public globalToLocalRect(x: number, y: number, width: number, height: number) {
			return this.getMatrix().transformRect(x, y, width, height);
		}

		public localToGlobalPoint(x: number, y: number) {
			return this._getMatrixInverted().transformPoint(x, y);
		}

		public localToGlobalRect(x: number, y: number, width: number, height: number) {
			return this._getMatrixInverted().transformRect(x, y, width, height);
		}

		public moveViewTarget(dx: number, dy: number) {
			this._setTarget(this._viewTargetX + dx, this._viewTargetY + dy);
			this._isDirty = true;
		}

		public setViewPixelSize(width: number, height: number) {
			this._viewPixelWidth = width;
			this._viewPixelHeight = height;
			this._viewPixelHalfWidth = this._viewPixelWidth * 0.5;
			this._viewPixelHalfHeight = this._viewPixelHeight * 0.5;
			this._isDirty = true;
		}

		public setViewTarget(tx: number, ty: number) {
			this._setTarget(tx, ty);
			this._isDirty = true;
		}

		public setViewZoom(value: number) {
			this._viewZoom = value;
			this._isDirty = true;
		}

		public setViewZoomTo(value: number, tx: number, ty: number) {
			this._setTarget(tx, ty);
			this._viewZoom *= value;
			this._isDirty = true;
		}
	}
}