import React from 'react';
import { observer } from 'mobx-react-lite';
import { useAnnotationService } from './AnnotationService';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';

const LabelList = observer(() => {
    const store = useAnnotationService();

    const handleLabelClick = (labelId: string) => {
        store.setSelectedLabelId(labelId);
    };

    const labelButtons = Array.from(store.labels.values()).map(
        (label) => {
            return (
                <MDButton
                    key={label.uuid}
                    onClick={() => handleLabelClick(label.uuid)}
                    variant="contained"
                    size="small"
                    color={label.badgeName || 'info'}
                >
                    {label.tag}
                </MDButton>
            );
        }
    );

    return (
        <MDBox>
            {labelButtons}
        </MDBox>
    );
});

export default LabelList;
