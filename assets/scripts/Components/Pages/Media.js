import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import styled from 'react-emotion';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';
import { withMatch } from '../Routing';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Clients';
import Entries from '../Entries';
import Form from '../Form';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import MediaAddForm from '../Forms/MediaAdd';
import MediaManageForm from '../Forms/MediaManage';

import Common from './Common';

import { Wrapper, Title, Button, BorderWrapper, MediaWrapper } from './Media.style.js';

/**
 * Works page
 */
class Media extends Common {
    constructor(props) {
        super(props);

        this.photosGridWrapper = null;
        this.videosGridWrapper = null;

        // this.setPhotosGridWrapperRef = this.setPhotosGridWrapperRef.bind(this);
        // this.setVideosGridWrapperRef = this.setVideosGridWrapperRef.bind(this);
        // this.changeMediaTab = this.changeMediaTab.bind(this);

        this.state = {
            isLoad: false
        }
    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.setState({isLoad: true});
            this.props.actions.load('media/photos',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('media/videos',{map:{meetup:this.props.match.params.id}});
        }
    }

    handleAddMedia(){
        this.props.modalsActions.modalOpening('add-media-modal');
    }

    handleEditMedia(media,type){
        this.props.modalsActions.modalOpening('manage-media-modal', {
            ...media,
            type: type
        });
    }













































    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() } type2={"media/videos"}>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить медиафайл" 
                modalId="add-media-modal" 
                modalClass="modal_size_sm"
            >
                <MediaAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать медиафайл" 
                modalId="manage-media-modal" 
                modalClass="modal_size_sm" 
                form={MediaManageForm}
            />

            { this.getMessagingModals() }
            </>
        );
    }












    getPageContent() {
        if(!this.props.state['media/photos'].items || !this.props.state['media/videos'].items) return null;
        
        const photos = this.props.state['media/photos'].items;
        const videos = this.props.state['media/videos'].items;

        console.log('::: photos');
        console.log(photos);
        
        // const videos = [
        //     {id: 1,title: 'Видео1',description: 'Описание1',preview: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bob-1517936249.jpg'},
        //     {id: 2,title: 'Видео2',description: 'Описание2',preview: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bob-1517936249.jpg'},
        //     {id: 3,title: 'Видео3',description: 'Описание3',preview: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bob-1517936249.jpg'},
        // ];

        return(
            <Wrapper>
                <div className="content__fragment content__filter-area" style={{height:'42.1px'}}>
                    <Title>Медиафайлы</Title>

                    <ActionButtons.Create 
                        caption="Добавить" 
                        modalId="add-media-modal"
                    />
                </div>
                <div className="content__fragment">
                    <BorderWrapper style={{marginTop:'40px'}}>
                        <div style={{width:'120px'}}>Видеоролики</div>
                    </BorderWrapper>
                    <MediaWrapper style={{marginTop:'22px'}}>
                        {videos.map(v => (
                            <div key={`media_videos_list_${v.id}`} onClick={()=>this.handleEditMedia(v,1)}>
                                <div style={{backgroundImage:`url(${v.preview})`}}></div>
                                <div className="video-button"></div>
                                <div>
                                    {v.title}<br/>
                                    <span>{v.description}</span>
                                </div>
                            </div>
                        ))}
                    </MediaWrapper>
                    <BorderWrapper style={{marginTop:'45px'}}>
                        <div style={{width:'114px'}}>Фотографии</div>
                    </BorderWrapper>
                    <MediaWrapper style={{marginTop:'22px'}}>
                        {photos.map(p => {
                            const obj = p.preview ? p : p[0];
                            const preview = p.preview ? p.preview : p[0].preview;

                            return <div key={`media_photos_list_${obj.id}`} onClick={()=>this.handleEditMedia(obj,0)}>
                                <div style={{backgroundImage:`url(${preview})`}}></div>
                                <div>
                                    {obj.title}<br/>
                                    <span>{obj.description}</span>
                                </div>
                            </div>;
                        })
                    }
                    </MediaWrapper> 
                </div>
            </Wrapper>
        )
    }
    
    



























































    getPageTitle() {
        return 'Список медиафайлов';
    }

    getEntriesType() {
        return 'media/photos';
    }

    changeMediaTab(event) {
        const trigger = event.target;
        const tab = parseInt(trigger.value);

        switch(tab) {
            case 1:
                this.videosGridWrapper.style.display = 'none';
                this.photosGridWrapper.removeAttribute('style');
                break;

            case 2:
                this.photosGridWrapper.style.display = 'none';
                this.videosGridWrapper.removeAttribute('style');
                break;
        }
    }

    // getPageContent() {
    //     const entriesType = this.getEntriesType();

    //     return (
    //         <div className="media-grid">
    //             <div className="media-grid__controls">
    //                 <Form.Toggle
    //                     choices={{
    //                         1: 'Изображения',
    //                         2: 'Видео'
    //                     }}
    //                     onToggle={this.changeMediaTab}
    //                     name="type"
    //                     value={1}
    //                     type="media-types"
    //                 />

    //                 <ActionButtons.AddMedia />
    //             </div>

    //             <div ref={this.setPhotosGridWrapperRef} className="media-grid__content media-grid__content_type_photos">
    //                 <Entries.PhotosGrid 
    //                     entriesType={'media/photos'}
    //                     actionParams={this.getActionParams()}
    //                 />
    //             </div>

    //             <div ref={this.setVideosGridWrapperRef} className="media-grid__content media-grid__content_type_videos" style={{
    //                 display: 'none'
    //             }}>
    //                 <Entries.VideosGrid 
    //                     entriesType={'media/videos'}
    //                     actionParams={this.getActionParams()}
    //                 />
    //             </div>
    //         </div>
    //     );
    // }

    // setPhotosGridWrapperRef(element) {
    //     this.photosGridWrapper = element;
    // }

    // setVideosGridWrapperRef(element) {
    //     this.videosGridWrapper = element;
    // }

    // getActionParams() {
    //     const { match } = this.props;

    //     return {
    //         map: {
    //             meetup: (match && match.params.id) || null
    //         }
    //     };
    // }

    getFilter() {
        return null;
    }
}

// Prop Types
Media.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch),
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Media));