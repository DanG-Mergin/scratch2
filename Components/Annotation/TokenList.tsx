import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';
import { useAnnotationService } from './AnnotationService';
import { observer } from 'mobx-react';
import Token from './Token';
// import Entity from './Entity';
// import { Grid } from '@mui/material';
import MDBox from 'components/MDBox';
// import { VirtualElementPopper } from './VirtualElementPopper';
import { LabelSpeedDial } from './LabelSpeedDial';
import Popper, { PopperProps } from '@mui/material/Popper';

const TokenList = observer(() => {
  // function TokenList() {
  const store = useAnnotationService();
  // const { tokens } = store;
  const [selectionBox, setSelectionBox] = useState<Box>();
  const [open, setPopperIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<PopperProps['anchorEl']>(null);

  const selectableItems = useRef<DOMRect[]>([]);
  const elementsContainerRef = useRef<HTMLDivElement | null>(null);

  const { DragSelection } = useSelectionContainer({
    // eventsElement: document.getElementById('root'),
    eventsElement: document.body,
    // getAnchorElement: () => {

    // },
    onSelectionChange: (box) => {
      const scrollAwareBox = {
        ...box,
        top: box.top + window.scrollY,
        left: box.left + window.scrollX
      }

      setSelectionBox(scrollAwareBox);

      const tokenIdsToSelect: string[] = [];

      selectableItems.current.forEach((item, index) => {
        if (boxesIntersect(scrollAwareBox, item)) {
          tokenIdsToSelect.push(`${index}`);
        }
      });

      store.setSelectedIndices(tokenIdsToSelect);

    },
    onSelectionStart: () => {
      setPopperIsOpen(false);
    },
    onSelectionEnd: () => {
      const tokenIdsToSelect = [...store.selectedIndices];
      if (tokenIdsToSelect.length > 0) {
        // console.info(tokenIdsToSelect);
        const middleIndex = tokenIdsToSelect[Math.floor(tokenIdsToSelect.length / 2)];
        setPopperIsOpen(true);
        setAnchorEl(
          document.getElementById(`token-${middleIndex}`) as HTMLElement
        );
      } else {
        setPopperIsOpen(false);
      }
    },
    // currently hiding the selection box as we have a layout race condition with something in the header
    // probably the stupid router
    selectionProps: {
      style: {
        border: '0px dashed purple',
        borderRadius: 0,
        backgroundColor: 'brown',
        opacity: 0.0,
      },
    },
    shouldStartSelecting: (target) => {
      // do something with target to determine if the user should start selecting

      return true;
    }
  });

  const initSelectableProps = (elementsContainerRef: React.MutableRefObject<HTMLDivElement | null>) => {
    if (elementsContainerRef.current) {
      const current: DOMRect[] = [];

      Array.from(elementsContainerRef.current.children).forEach((item) => {
        current.push(item.getBoundingClientRect())
      });
      selectableItems.current = current;
    }
  }
  useLayoutEffect(() => {
    initSelectableProps(elementsContainerRef);
  }, [elementsContainerRef.current]);

  return (
    <MDBox className="container">
      <MDBox ref={elementsContainerRef}>
        <LabelSpeedDial open={open} anchorEl={anchorEl as HTMLElement} />
      </MDBox>
      {/* {store.selectedIndices} */}
      <DragSelection />
      <MDBox
        id="elements-container"
        className="elements-container"
        ref={elementsContainerRef}
        display="flex"
        flexWrap={{ xs: 'wrap' }}
        alignItems="flex-start"
      >
        {[...store.tokens].map(([k, v]) => (
          <Token key={`token-${k}`} token={v} />
        ))}
      </MDBox>
    </MDBox>
  );
});

export default TokenList;