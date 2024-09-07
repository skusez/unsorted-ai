

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {DRAG_DROP_PASTE} from '@lexical/rich-text';
import {isMimeType, mediaFileReader} from '@lexical/utils';
import {COMMAND_PRIORITY_LOW} from 'lexical';
import {useEffect} from 'react';

import {INSERT_IMAGE_COMMAND} from '../ImagesPlugin';

const ACCEPTABLE_IMAGE_TYPES = [
  'image/',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/webp',
];

export default function DragDropPaste(): null {
  const [editor] = useLexicalComposerContext();
  
// TODO integrate supabase storage here

  useEffect(() => {
    return editor.registerCommand(
      DRAG_DROP_PASTE,
      (files) => {
        (async () => {
          console.log(files);
          for (const file of files) {
            // TODO integrate supabase storage here
            // const res = await edgestore.publicFiles.upload({
            //   file
            // });
            // if(res.url){
            //   editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            //     altText: file.name,
            //     src: res.url,
            //   });
            // }
            console.log("file", file);
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: file.name,
              src: URL.createObjectURL(file),
            });
          }
        })();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);
  return null;
}