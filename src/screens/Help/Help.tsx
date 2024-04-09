// // import React, { Component, ReactElement } from 'react';
// // import { EditorState, ContentState, convertFromRaw, RawDraftContentState } from 'draft-js';
// // import { Editor } from 'react-draft-wysiwyg';
// // import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// // const content: RawDraftContentState = {
// //   entityMap: {},
// //   blocks: [
// //     {
// //       key: '637gr',
// //       text: 'Initialized from content state.',
// //       type: 'unstyled',
// //       depth: 0,
// //       inlineStyleRanges: [],
// //       entityRanges: [],
// //       data: {},
// //     },
// //   ],
// // };

// // interface EditorConvertToJSONState {
// //   contentState: EditorState;
// // }

// // class EditorConvertToJSON extends Component<{}, EditorConvertToJSONState> {
// //   constructor(props: {}) {
// //     super(props);
// //     const contentState = convertFromRaw(content);
// //     const editorState = EditorState.createWithContent(contentState);
// //     this.state = {
// //       contentState: editorState,
// //     };
// //   }

// //   onContentStateChange = (contentState: EditorState): void => {
// //     this.setState({
// //       contentState,
// //     });
// //   };

// //   render(): ReactElement {
// //     const { contentState } = this.state;
// //     return (
// //       <div>
// //         <Editor
// //           wrapperClassName="demo-wrapper"
// //           editorClassName="demo-editor"
// //           editorState={contentState}
// //           onEditorStateChange={this.onContentStateChange}
// //         />
// //         {/* <textarea
// //           disabled
// //           value={JSON.stringify(contentState.getCurrentContent(), null, 4)}
// //         /> */}
// //       </div>
// //     );
// //   }
// // }

// // export default EditorConvertToJSON;

// import React, { Component, ReactElement } from 'react';
// import { EditorState, convertFromRaw, RawDraftContentState } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// const content: RawDraftContentState = {
//   entityMap: {},
//   blocks: [
//     {
//       key: '637gr',
//       text: 'Initialized from content state.',
//       type: 'unstyled',
//       depth: 0,
//       inlineStyleRanges: [],
//       entityRanges: [],
//       data: {},
//     },
//   ],
// };

// interface EditorConvertToJSONState {
//   contentState: EditorState;
// }

// class EditorConvertToJSON extends Component<{}, EditorConvertToJSONState> {
//   constructor(props: {}) {
//     super(props);
//     const contentState = convertFromRaw(content);
//     const editorState = EditorState.createWithContent(contentState);
//     this.state = {
//       contentState: editorState,
//     };
//   }

//   onContentStateChange = (contentState: EditorState): void => {
//     this.setState({
//       contentState,
//     });
//   };

//   renderFontSizeDropdown = () => {
//     return (
//       <select
//         className="custom-font-size-dropdown" // Define your custom CSS class for the dropdown
//         onChange={(e) => {
//           const newFontSize = parseInt(e.target.value);
//           const newEditorState = this.state.contentState;
//           // You can implement logic to change font size here
//           // For simplicity, I'm just setting it as the new font size
//           this.setState({
//             contentState: newEditorState,
//           });
//         }}
//       >
//         {[8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72].map((size) => (
//           <option key={size} value={size}>
//             {size}
//           </option>
//         ))}
//       </select>
//     );
//   };

//   render(): ReactElement {
//     const { contentState } = this.state;
//     return (
//       <div>
//         <Editor
//           wrapperClassName="demo-wrapper"
//           editorClassName="demo-editor"
//           editorState={contentState}
//           onEditorStateChange={this.onContentStateChange}
//           toolbar={{
//             options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'remove', 'history'],
//             inline: {
//               options: ['bold', 'italic', 'underline'],
//             },
//             blockType: {
//               options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
//             },
//             list: {
//               options: ['unordered', 'ordered'],
//             },
//             textAlign: {
//               options: ['left', 'center', 'right'],
//             },
//             link: {
//               inDropdown: true,
//             },
//             history: {
//               inDropdown: true,
//             },
//             customControls: [
//               <this.renderFontSizeDropdown key="font-size-dropdown" />
//             ],
//           }}
//         />
//         <textarea
//           disabled
//           value={JSON.stringify(contentState.getCurrentContent(), null, 4)}
//         />
//       </div>
//     );
//   }
// }

// export default EditorConvertToJSON;

import React from 'react'
import '../../styles/Help.scss'
const Help = () => {
  return (
    <section id='help'>
      <div className='help-box'>
      <h4>SUPPORT TICKETS</h4>
        <p>Create new tickets and view current support cases in the Help Center</p>
      </div>
    
      <p className="mt-4 ticket-link">
        <a
          style={{
            color:
              "var(--Colours-Primary-colour-Blue-500)",
          }}
          href="https://ebizoncloud.io/support/"
          target="_blank"
          title='Fill the support form for ticket link'
        >
          Raised Tickets
          <img
            src={require("../../assets/Icons/arrow_outward.png")}
          />
        </a>
      </p>
    </section>
  )
}

export default Help
