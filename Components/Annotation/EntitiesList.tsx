import React, { ReactElement, useState } from 'react';
import { observer } from 'mobx-react';
import { v4 as uuidv4 } from 'uuid';

import { useAnnotationService } from './AnnotationService';
import pxToRem from "assets/theme/functions/pxToRem";
import MDBox from 'components/MDBox';

import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface EntitiesListProps {
  index: number;
}

const EntitiesList: React.FC<EntitiesListProps> = observer(({ index }) => {
  const [hover, setHover] = useState(false);
  const store = useAnnotationService();

  const handleMouseEnter = () => {
    setHover(true);
    // console.log('hover on');
  };

  const handleMouseLeave = () => {
    setHover(false);
    // console.log('hover off');
  };

  const handleDelete = (uuid: string) => {
    // console.info('You clicked the delete icon.');
    store.deleteEntity(uuid)
  };

  const overlappingEntities = store.getEntitiesByRange(index, index);
  // we're assuming that the entities will be returned according to overlap and order
  // so we can just render them in order
  const entitySpans = overlappingEntities.map((entity) => {
    const label = store.getLabelById(entity.labelId);
    if (entity.startIndex <= index && entity.endIndex >= index) {
      // entity is on this token not just overlapping with other entities for display
      // now we need to know if it's the first token of the entity
      if (entity.startIndex === index) {
        try {
          return (
            <MDBox
              width="0;"
              maxWidth="fit-content"
              display="inline-flex"
              key={`e-${entity.uuid}-t-${index}`}
              position="relative"
              cursor="pointer"
            >
              <MDBox
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                key={`e2-${entity.uuid}-t2-${index}`}
                color={label.badgeName || 'info'}
                display="inline-block"
                sx={{
                  padding: pxToRem(3),
                  position: "relative",
                  borderColor: (theme: any) => theme.palette.badgeColors[label.badgeName].text,
                  color: (theme: any) => theme.palette.badgeColors[label.badgeName].text,
                  background: (theme: any) => theme.palette.badgeColors[label.badgeName].background,
                  fontSize: 'x-small',
                  borderRadius: '0.375rem',
                  borderStyle: 'solid',
                  borderWidth: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {label.tag}
                {hover && (
                  <MDBox>
                    <IconButton
                      key={uuidv4()}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        color: "red",
                        background: "rgba(0,0,0,0.7)",
                        borderRadius: "0.375rem",
                        lineHeight: "1.4rem",
                        textAlign: "center",
                        fontWeight: "900",
                        display: "flex",
                      }}
                      onClick={() => handleDelete(entity.uuid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </MDBox>
                )}
              </MDBox>
            </MDBox>
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        // add a border spacer: the token is not the first token of the entity
        return (
          <MDBox
            key={uuidv4()}
            color={label.badgeName || 'info'}
            display="list-item"
            sx={{
              padding: pxToRem(3),
              borderColor: (theme: any) => theme.palette.badgeColors[label.badgeName].text,
              color: (theme: any) => theme.palette.badgeColors[label.badgeName].text,
              background: (theme: any) => theme.palette.badgeColors[label.badgeName].background,
              fontSize: 'x-small',
              borderRadius: '0.375rem',
              borderStyle: 'solid',
              borderWidth: 1,
            }}
          ></MDBox>
        );
      }
    }
    // add a spacer: the token is not part of the entity but is part of the entity group
    return (
      <MDBox
        border="1px solid transparent"
        display="list-item"
        sx={{
          padding: pxToRem(3),
          fontSize: 'x-small',
        }}
      ></MDBox>
    );
  });
  return (
    <>
      {entitySpans}
    </>
  )
});

export default EntitiesList;