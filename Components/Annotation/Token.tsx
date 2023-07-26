import React from 'react';
import { observer } from 'mobx-react';
import { useAnnotationService } from './AnnotationService';
import MDTypography from 'components/MDTypography';
import MDBox from 'components/MDBox';
import EntitiesList from './EntitiesList';

interface TokenProps {
    token: {
        id: string;
        text: string;
        index: number;
        spacesAfter: number;
        // entitySpacers?: string[];
        // entityIds?: string[];
    },
}

const Token: React.FC<TokenProps> = observer(({ token }) => {
    const store = useAnnotationService();
    const isSelected = store.selectedIndices.has(token.index);

    return (
        <MDBox
            margin={1}
            paddingRight={token.spacesAfter}
            marginLeft={0}
            marginRight={0}
            id={`token-${token.id}`}
            // className={`token${isSelected ? ' token--selected' : ''}`}
            position="relative"
            display="flex"
            flexDirection="column"
        >
            <MDTypography
                component="span"
                variant="body1"
                width="100%"
                data-index={token.index}
                sx={{
                    backgroundColor: isSelected ? 'lightblue' : 'inherit',
                    // fontWeight: isSelected ? 'bold' : 'inherit',
                }}
            >
                {token.text}
            </MDTypography>
            <MDBox
                display="flex"
                flexDirection="column"
                overflow="hidden"
            >
                <EntitiesList key={`entity-map-idx-${token.index}`} index={token.index} />
            </MDBox>
        </MDBox>
    );
});

export default Token;