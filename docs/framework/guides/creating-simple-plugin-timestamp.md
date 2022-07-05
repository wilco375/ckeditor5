---
category: framework-plugins
order: 10
---

# Creating a basic plugin - timestamp

This guide will show you how to create a most basic plugin that will let users insert timestamps into their document. This is a beginner friendly tutorial, perfect for your first interactions with CKEditor 5 and its framework.

<info-box>
	The easiest way to start is to clone the repository with our tutorials. Running webpack with the `-w` option will start it in the watch mode. This means that webpack will watch your files for changes and rebuild the application every time you save them.

	If you'd like to set up the framework and building tools yourself, check out the {@link framework/guides/quick-start Quick start} and the {@link framework/guides/package-generator package generator guide}.
</info-box>

We’ll create a toolbar button that will insert the current date and time at the caret position in the document. If you want to see the final product of this tutorial before you plunge in, check out the [demo](#demo).

## Let's start

We're going to write the whole plugin in your base `app.js` file. It should look like this (maybe with a couple of different imports if you chose to set up the environment yourself):

```js
// app.js

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ Essentials, Paragraph, Heading, List, Bold, Italic ],
		toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList' ]
	} )
	.then( editor => {
		console.log( 'Editor was initialized', editor );
	} )
	.catch( error => {
		console.error( error.stack );
	} );
```

Your `index.html` should look like this. The editor will load with HTML content you put in the `<div id="editor">`.

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>CKEditor 5 Framework – timestamp plugin</title>
	</head>
	<body>
		<div id="editor">
			<h2>Timestamp plugin</h2>
			<p>Press the timestamp button to insert the current date and time.</p>
		</div>

		<script src="dist/bundle.js"></script>
	</body>
</html>
```
## Creating a plugin

All features in the CKEditor 5 are introduced by plugins implementing the {@link module:core/plugin~PluginInterface}. Your custom timestamp plugin is no exception, so it needs to extend the {@link module:core/plugin~Plugin base `Plugin` class}.

Once we have `Plugin` imported, we're ready to create our custom timestamp plugin. After we define it, we can add it into the editor's `config.plugins` array.

```js
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

class Timestamp extends Plugin {
    init() {
        console.log( 'Timestamp was initialized.' );
    }
}

ClassicEditor
	.create( document.querySelector( '#editor' ), {

		//Add the Timestamp plugin to config.plugins array
		plugins: [ 
			Timestamp, Essentials, Paragraph, Heading, List, Bold, Italic
			], 
		toolbar: [ 'heading', 'bold', 'italic', 'numberedList', 'bulletedList' ]
	} )
	.then( editor => {
		console.log( 'Editor was initialized', editor );
	} )
	.catch( error => {
		console.error( error.stack );
	} );
```
Rebuild and check in your console if the timestamp was initialized. You should see this: SCREENSHOT

## Registering a toolbar button

CKEditor 5 has a rich UI library, from where we'll grab the {@link module:ui/button/buttonview~ButtonView `ButtonView`} class for our toolbar button. 

Once we create a new instance of the `ButtonView`, we'll be able to customize it by setting its properties. We'll create a label, which will be visible on the button thanks to the `withText` property. 

We need to register our button in the editor's UI {@link module:ui/componentfactory~ComponentFactory `componentFactory`}, so it can be displayed in the toolbar. We'll pass the name of the button in the `componentFactory.add` method, so we'll be able to add it into the `config.toolbar` array.

```js
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class Timestamp extends Plugin {
	init() {
		const editor = this.editor;

		// The button must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add( 'timestamp', locale => {
			
			// The button will be an instance of ButtonView
			const button = new ButtonView( locale );

			button.set( {
				label: 'Timestamp',
				withText: true
			} );

			return button;
		} );
	}
}

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ 
			Timestamp, Essentials, Paragraph, Heading, List, Bold, Italic 
			], 

		//Add the Timestamp button to the config.toolbar array
		toolbar: [ 
			'timestamp', 'heading', 'bold', 'italic', 'numberedList', 'bulletedList'
			] 
	} )
	.then( editor => {
		console.log( 'Editor was initialized', editor );
	} )
	.catch( error => {
		console.error( error.stack );
	} );

```
You should be able to see the timestamp button now. It doesn't do anything just yet, so let's change that. 

## Inserting a timestamp

We can now define the core funcitonality of our plugin, the action that should be executed once our button is clicked. 

When we want to insert something into the document structure (or change it in any other way), we need to use the model writer, available in the model's `change()` method. 

<info-box>
	What is the model? It's a DOM-like structure, that is converted into the view, which is what the user interacts with. If you want to learn more, you can read about it in the {@link framework/guides/architecture/editing-engine#overview editing engine architecture}. Don't be intimidated by the diagram you can find there, as you don't need to understand it in its full complexity to implement custom plugins.   
</info-box>

We'll use the {link module:engine/model/writer~Writer#insertText `writer.insertText()`} method to insert our timestamp into the document. We'll also need to give it a position of the user's current selection to indicate where to insert our timestamp (using the {@link module:engine/model/position~Position `Position`} class). 

Finally, if the user's selection has a range (so it's a letter, word, or a whole text fragment), we'll remove that and replace it with our timestamp.

```js
class Timestamp extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'timestamp', locale => {
			
			//...

			//Execute a callback function when the button is clicked
			button.on( 'execute', () => {
				const now = new Date();
				const selection = editor.model.document.selection;

				//Change the model using the model writer
				editor.model.change( writer => {

					//Insert the text at the user's current position
					writer.insertText( `${ now.toString() }`, selection.getFirstPosition() );

					//Remove selected elements
					for ( const range of selection.getRanges() ) {
						writer.remove( range );
					}
				} );
			} );

			return button;
		} );
	}
}
```

Well done! Your timestamp plugin is now ready. 

What's next? You can read more about the {@link framework/guides/overview CKEditor 5 framework}, or continue with our next tutorial, where we'll create {@link framework/guides/simple-plugin-tutorial/abbreviation-plugin-level-1 an abbreviation plugin}. 

## Demo

{@snippet framework/timestamp-plugin}

## Full code

```js

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

class Timestamp extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'timestamp', locale => {
			const button = new ButtonView( locale );

			button.set( {
				label: 'Timestamp',
				withText: true
			} );

			button.on( 'execute', () => {
				const now = new Date();
				const selection = editor.model.document.selection;

				editor.model.change( writer => {
					writer.insertText( `${ now.toString() }`, selection.getFirstPosition() );

					for ( const range of selection.getRanges() ) {
						writer.remove( range );
					}
				} );
			} );

			return button;
		} );
	}
}

ClassicEditor
	.create( document.querySelector( '#snippet-timestamp-plugin' ), {
		plugins: [ Essentials, Bold, Italic, Heading, List, Paragraph, Timestamp ],
		toolbar: [ 'heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', '|', 'timestamp' ]
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err );
	} );

```