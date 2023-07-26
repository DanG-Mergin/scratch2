import React from 'react';
import { observer } from 'mobx-react-lite';
import { useAnnotationService } from './AnnotationService';
import { SpeedDial, SpeedDialIcon, SpeedDialAction, Fade, Tooltip } from '@mui/material';
import Popper from '@mui/material/Popper';
import MDBox from 'components/MDBox';
import { v4 as uuidv4 } from 'uuid';
import iconStore from './IconStore';
import { useTheme } from '@mui/material/styles';


interface Props {
  open: boolean
  anchorEl: HTMLElement | React.ReactElement | null
}

export const LabelSpeedDial: React.FC<Props> = observer(({ open, anchorEl }) => {
  const store = useAnnotationService();
  const theme = useTheme();

  const handleLabelClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const val = e.currentTarget.dataset.uuid;
    if (val) {
      store.setSelectedLabelId(val);
    }
  };
  const labelsByCategory = [...store.labelsByCategory];

  return (
    <Popper
      keepMounted={true} //render only once and stay in the dom
      id={`speed-dial-popper`}
      key={uuidv4()}
      open={open}
      // @ts-ignore
      anchorEl={anchorEl}
      transition
      placement={'bottom'}
      modifiers={[
        {
          name: 'flip',
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
        {
          name: 'preventOverflow',
          enabled: false,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
      ]}
    >

      {({ TransitionProps }) => (
        <Fade {...TransitionProps} key={uuidv4()} timeout={350}>
          <MDBox
            key={uuidv4()}
            display="flex"
            flexDirection="row"
          >
            {labelsByCategory.map((category) => {

              return (
                <Tooltip key={uuidv4()} title={category.generic.tag} placement="top">
                  <SpeedDial
                    key={uuidv4()}
                    ariaLabel="SpeedDial openIcon example"
                    // @ts-ignore
                    FabProps={{ size: 'small', variant: 'extended', color: category.generic.badgeName }}
                    icon={
                      <SpeedDialIcon
                        key={uuidv4()}
                        icon={iconStore.getIcon(category.generic.icon)}
                        openIcon={iconStore.getIcon(category.generic.icon)}
                      />
                    }
                    data-uuid={category.generic.uuid}
                    onClick={handleLabelClick}
                    direction={'down'}
                  >
                    {category.specific.map((label) => {
                      const IconComponent = iconStore.getIcon(label.icon);
                      if (!IconComponent) {
                        console.warn(`Icon "${label.icon}" not found`);
                        return null;
                      }
                      const color = theme.palette.badgeColors[label.badgeName].text;
                      const background = theme.palette.badgeColors[label.badgeName].background;

                      return (
                        <SpeedDialAction
                          tooltipOpen={true}
                          key={uuidv4()}
                          icon={iconStore.getIcon(label.icon)}
                          tooltipTitle={label.tag}
                          data-uuid={label.uuid}
                          onClick={handleLabelClick}
                          FabProps={{
                            size: 'small',
                            variant: 'extended',
                            style: {
                              "color": color,
                              "background": background,
                              "fontSize": ".75rem",
                            }
                          }}
                        />
                      );
                    })}
                  </SpeedDial>
                </Tooltip>
              );
            })}
          </MDBox>
        </Fade>
      )}
    </Popper>
  );
});

export default LabelSpeedDial;
