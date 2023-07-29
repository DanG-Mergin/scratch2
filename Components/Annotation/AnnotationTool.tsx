import { useEffect, useState, useRef, forwardRef } from 'react';
import { AnnotationSvcProvider, useAnnotationService } from './AnnotationService';
import { Box, Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import TokenList from './TokenList';
import { LoadingComponent } from './Loading';
import MDPagination from "components/MDPagination";
import Icon from "@mui/material/Icon";
import MDButton from 'components/MDButton';
import AnnotationSelector from './AnnotationSelector';

const AnnotationTool = () => {
    return (
        <AnnotationSvcProvider docId="123">
            <AnnotationWrap />
        </AnnotationSvcProvider>
    );
};

const AnnotationWrap = observer(() => {
    const annotationService = useAnnotationService();
    const [isLoading, setIsLoading] = useState(true);

    const handleSubmitClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        annotationService.submitAnnotation();
    };

    useEffect(() => {
        if (!annotationService.isLoading) {
            setIsLoading(false);
        }
    }, [annotationService.isLoading]);

    if (isLoading) {
        return <LoadingComponent />;
    }

    return (
        <>
            <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2 }}
                justifyContent="center" alignItems="center"
            >
                <Grid container item justifyContent="center" alignItems="center" xs={3}>
                </Grid>

                <Grid container item justifyContent="center" alignItems="center" xs={12} md={6}>
                    <AnnotationSelector />
                </Grid>

                <Grid container item justifyContent="flex-end" alignItems="center" xs={3}>
                    <MDButton display="inline-flex" variant="gradient" color="primary" size="large" onClick={handleSubmitClick} >Accept</MDButton>
                </Grid>
            </Grid>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} id="annotation-event-root">
                <Grid container item xs={12}>
                    <TokenList />
                </Grid>
            </Grid>
        </>
    );
});

export default AnnotationTool;