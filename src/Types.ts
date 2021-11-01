
namespace Vgx {

	export type DynamicObject = {[name: string]: any}; 

	export type TypedObject<T extends any> = {[name: string]: T}; 

	export type Action = () => void;

	export type KeyValuePair<TKey extends any, TValue extends any> = {key: TKey, value: TValue};


	// Cgx types mapping

	export type Brush = Cgx.Brush;

	export type BrushDefinition = Cgx.BrushDefinition;

	export type BrushType = Cgx.BrushType;

	export type Transform = Cgx.Transform;

	export type Point = Cgx.Point;

	export type Size = Cgx.Size;

}