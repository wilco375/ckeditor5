/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontsize
 */

import type { ViewElementDefinition, MatcherPattern } from 'ckeditor5/src/engine';
import { Plugin, type PluginDependencies } from 'ckeditor5/src/core';
import FontSizeEditing from './fontsize/fontsizeediting';
import FontSizeUI from './fontsize/fontsizeui';
import { normalizeOptions } from './fontsize/utils';

/**
 * The font size plugin.
 *
 * For a detailed overview, check the {@glink features/font font feature} documentation
 * and the {@glink api/font package page}.
 *
 * This is a "glue" plugin which loads the {@link module:font/fontsize/fontsizeediting~FontSizeEditing} and
 * {@link module:font/fontsize/fontsizeui~FontSizeUI} features in the editor.
 */
export default class FontSize extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get requires(): PluginDependencies {
		return [ FontSizeEditing, FontSizeUI ];
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName(): 'FontSize' {
		return 'FontSize';
	}

	/**
	 * Normalizes and translates the {@link module:font/fontsize~FontSizeConfig#options configuration options}
	 * to the {@link module:font/fontsize~FontSizeOption} format.
	 *
	 * @param configuredOptions An array of options taken from the configuration.
	 */
	public normalizeSizeOptions( options: Array<string | number | FontSizeOption> ): Array<FontSizeOption> {
		return normalizeOptions( options );
	}
}

/**
 * The font size option descriptor.
 */
export interface FontSizeOption {

	/**
	 * The user-readable title of the option.
	 */
	title: string;

	/**
	 * The attribute's unique value in the model.
	 */
	model?: string;

	/**
	 * View element configuration.
	 */
	view?: ViewElementDefinition;

	/**
	 * An array with all matched elements that the view-to-model conversion should also accept.
	 */
	upcastAlso?: Array<MatcherPattern>;
}

 declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ FontSize.pluginName ]: FontSize;
	}

	interface EditorConfig {

		/**
		 * The configuration of the font size feature.
		 * It is introduced by the {@link module:font/fontsize/fontsizeediting~FontSizeEditing} feature.
		 *
		 * Read more in {@link module:font/fontsize~FontSizeConfig}.
		 */
		fontSize?: FontSizeConfig;
	}
}

/**
 * The configuration of the font size feature.
 * This option is used by the {@link module:font/fontsize/fontsizeediting~FontSizeEditing} feature.
 *
 * ```ts
 * ClassicEditor
 * 	.create( {
 * 		fontSize: ... // Font size feature configuration.
 * 	} )
 * 	.then( ... )
 * 	.catch( ... );
 * ```
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 */
export interface FontSizeConfig {

	/**
	 * Available font size options. Expressed as predefined presets, numerical "pixel" values
	 * or the {@link module:font/fontsize~FontSizeOption}.
	 *
	 * The default value is:
	 *
	 * ```ts
	 * const fontSizeConfig = {
	 * 	options: [
	 * 		'tiny',
	 * 		'small',
	 * 		'default',
	 * 		'big',
	 * 		'huge'
	 * 	]
	 * };
	 * ```
	 *
	 * It defines 4 sizes: **tiny**, **small**, **big**, and **huge**. These values will be rendered as `<span>` elements in the view.
	 * The **default** defines a text without the `fontSize` attribute.
	 *
	 * Each `<span>` has the the `class` attribute set to the corresponding size name. For instance, this is what the **small** size looks
	 * like in the view:
	 *
	 * ```html
	 * <span class="text-small">...</span>
	 * ```
	 *
	 * As an alternative, the font size might be defined using numerical values (either as a `Number` or as a `String`):
	 *
	 * ```ts
	 * const fontSizeConfig = {
	 * 	options: [ 9, 10, 11, 12, 13, 14, 15 ]
	 * };
	 * ```
	 *
	 * Also, you can define a label in the dropdown for numerical values:
	 *
	 * ```ts
	 * const fontSizeConfig = {
	 * 	options: [
	 * 		{
	 * 				 	title: 'Small',
	 * 				 	model: '8px'
	 * 				},
	 * 				'default',
	 * 				{
	 * 				 	title: 'Big',
	 * 				 	model: '14px'
	 * 				}
	 * 	]
	 * };
	 * ```
	 *
	 * Font size can be applied using the command API. To do that, use the `'fontSize'` command and pass the desired font size as a `value`.
	 * For example, the following code will apply the `fontSize` attribute with the **tiny** value to the current selection:
	 *
	 * ```ts
	 * editor.execute( 'fontSize', { value: 'tiny' } );
	 * ```
	 *
	 * Executing the `fontSize` command without value will remove the `fontSize` attribute from the current selection.
	 */
	options?: Array<string | number | FontSizeOption>;

	/**
	 * By default the plugin removes any `font-size` value that does not match the plugin's configuration.
	 * It means that if you paste content with font sizes that the editor does not understand, the `font-size` attribute
	 * will be removed and the content will be displayed with the default size.
	 *
	 * You can preserve pasted font size values by switching the `supportAllValues` option to `true`:
	 *
	 * ```ts
	 * const fontSizeConfig = {
	 * 	options: [ 9, 10, 11, 12, 'default', 14, 15 ],
	 * 	supportAllValues: true
	 * };
	 * ```
	 *
	 * **Note:** This option can only be used with numerical values as font size options.
	 *
	 * With this configuration font sizes not specified in the editor configuration will not be removed when pasting the content.
	 */
	supportAllValues?: boolean;
	}

