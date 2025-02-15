/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontcolor
 */

import type { ColorOption } from 'ckeditor5/src/ui';
import { Plugin, type PluginDependencies } from 'ckeditor5/src/core';
import FontColorEditing from './fontcolor/fontcolorediting';
import FontColorUI from './fontcolor/fontcolorui';

/**
 * The font color plugin.
 *
 * For a detailed overview, check the {@glink features/font font feature} documentation
 * and the {@glink api/font package page}.
 *
 * This is a "glue" plugin which loads the {@link module:font/fontcolor/fontcolorediting~FontColorEditing} and
 * {@link module:font/fontcolor/fontcolorui~FontColorUI} features in the editor.
 */
export default class FontColor extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires(): PluginDependencies {
		return [ FontColorEditing, FontColorUI ];
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName(): 'FontColor' {
		return 'FontColor';
	}
}

 declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ FontColor.pluginName ]: FontColor;
	}

	interface EditorConfig {

		/**
		 * The configuration of the font color feature.
		 * It is introduced by the {@link module:font/fontcolor/fontcolorediting~FontColorEditing} feature.
		 *
		 * Read more in {@link module:font/fontcolor~FontColorConfig}.
		 */
		fontColor?: FontColorConfig;
	}
}

/**
 * The configuration of the font color and font background color features.
 * This option is used by the {@link module:font/fontcolor/fontcolorediting~FontColorEditing} and
 * {@link module:font/fontbackgroundcolor/fontbackgroundcolorediting~FontBackgroundColorEditing} features.
 *
 * ```ts
 * ClassicEditor
 * 	.create( {
 * 		fontColor: ... // Font color feature configuration.
 * 		fontBackgroundColor: ... // Font background color feature configuration.
 * 	} )
 * 	.then( ... )
 * 	.catch( ... );
 * ```
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 */
export interface FontColorConfig {

	/**
	 * Available font colors defined as an array of strings or objects.
	 *
	 * The default value registers the following colors:
	 *
	 * ```ts
	 * const fontColorConfig = {
	 * 	colors: [
	 * 		{
	 * 			color: 'hsl(0, 0%, 0%)',
	 * 			label: 'Black'
	 * 		},
	 * 		{
	 * 			color: 'hsl(0, 0%, 30%)',
	 * 			label: 'Dim grey'
	 * 		},
	 * 		{
	 * 			color: 'hsl(0, 0%, 60%)',
	 * 			label: 'Grey'
	 * 		},
	 * 		{
	 * 			color: 'hsl(0, 0%, 90%)',
	 * 			label: 'Light grey'
	 * 		},
	 * 		{
	 * 			color: 'hsl(0, 0%, 100%)',
	 * 			label: 'White',
	 * 			hasBorder: true
	 * 		},
	 * 		{
	 * 			color: 'hsl(0, 75%, 60%)',
	 * 			label: 'Red'
	 * 		},
	 * 		{
	 * 			color: 'hsl(30, 75%, 60%)',
	 * 			label: 'Orange'
	 * 		},
	 * 		{
	 * 			color: 'hsl(60, 75%, 60%)',
	 * 			label: 'Yellow'
	 * 		},
	 * 		{
	 * 			color: 'hsl(90, 75%, 60%)',
	 * 			label: 'Light green'
	 * 		},
	 * 		{
	 * 			color: 'hsl(120, 75%, 60%)',
	 * 			label: 'Green'
	 * 		},
	 * 		{
	 * 			color: 'hsl(150, 75%, 60%)',
	 * 			label: 'Aquamarine'
	 * 		},
	 * 		{
	 * 			color: 'hsl(180, 75%, 60%)',
	 * 			label: 'Turquoise'
	 * 		},
	 * 		{
	 * 			color: 'hsl(210, 75%, 60%)',
	 * 			label: 'Light blue'
	 * 		},
	 * 		{
	 * 			color: 'hsl(240, 75%, 60%)',
	 * 			label: 'Blue'
	 * 		},
	 * 		{
	 * 			color: 'hsl(270, 75%, 60%)',
	 * 			label: 'Purple'
	 * 		}
	 * 	]
	 * };
	 * ```
	 *
	 * **Note**: The colors are displayed in the `'fontColor'` dropdown.
	 */
	colors?: Array<string | ColorOption>;

	/**
	 * Determines the maximum number of available document colors.
	 * Setting it to `0` will disable the document colors feature.
	 *
	 * By default it equals to the {@link module:font/fontcolor~FontColorConfig#columns} value.
	 *
	 * Examples:
	 *
	 * ```ts
	 * // 1) Neither document colors nor columns are defined in the configuration.
	 * // Document colors will equal 5,
	 * // because the value will be inherited from columns,
	 * // which has a predefined value of 5.
	 * const fontColorConfig = {}
	 *
	 * // 2) Document colors will equal 8, because the value will be inherited from columns.
	 * const fontColorConfig = {
	 * 	columns: 8
	 * }
	 *
	 * // 3) Document colors will equal 24, because it has its own value defined.
	 * const fontColorConfig = {
	 * 	columns: 8,
	 * 	documentColors: 24
	 * }
	 *
	 * // 4) The document colors feature will be disabled.
	 * const fontColorConfig = {
	 * 	columns: 8,
	 * 	documentColors: 0
	 * }
	 * ```
	 */
	documentColors?: number;

	/**
	 * Represents the number of columns in the font color dropdown.
	 *
	 * The default value is:
	 *
	 * ```ts
	 * const fontColorConfig = {
	 * 	columns: 5
	 * }
	 * ```
	 */
	columns?: number;
}

