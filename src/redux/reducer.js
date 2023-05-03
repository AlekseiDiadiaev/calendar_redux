import { createReducer } from "@reduxjs/toolkit"
import * as actions from './actions'


const {
    setSelectedDate,
    setScrollToHour,
    navBtnsClick,
    toggleEventModal,
    setEventModalDate,
    setCoordinatesСhosenCell,
    setIdСhosenCell,
    setCoordinatesEventModal,
    activeCanvasTrigger,
    toggleJoinModalShowed,
    toggleLoginModalShowed,
    userFetched,
    userFetching,
    setSelectedEvent,
    setUserEvents,
    setNumberOfColumns,
    toggleSidePanel,
    togglePastCell
} = actions;


const initialState = {
    selectedDate: new Date().setHours(0, 0, 0, 0),
    scrollToHour: 6,
    eventModalShowed: false,
    eventModalDate: 0,
    idСhosenCell: '',
    coordinatesСhosenCell: {},
    coordinatesEventModal: {},
    canvasTrigger: true,
    joinModalShowed: false,
    loginModalShowed: false,
    user: null,
    loadingUser: true,
    idSelectedEvent: null,
    userEvents: [],
    numberOfColumns: 7,
    sidePanelShown: false,
    didPastCellClick: false,
}

const reducer = createReducer(initialState,  builder => {
    builder
        .addCase(setSelectedDate,(state, action) => {
            state.selectedDate = action.payload
            state.eventModalShowed = false;
        })
        .addCase(setScrollToHour,(state, action) => {
            state.scrollToHour = action.payload;
        })
        .addCase(navBtnsClick,(state, action) => {
            state.selectedDate = state.selectedDate + action.payload;
            state.eventModalShowed = false;
        })
        .addCase(toggleEventModal,(state, action) => {
            state.eventModalShowed = action.payload;
        })
        .addCase(setEventModalDate,(state, action) => {
            state.eventModalDate = action.payload;
        })
        .addCase(setIdСhosenCell,(state, action) => {
            state.idСhosenCell = action.payload;
        })
        .addCase(setCoordinatesСhosenCell,(state, action) => {
            state.coordinatesСhosenCell = action.payload;
        })
        .addCase(setCoordinatesEventModal,(state, action) => {
            state.coordinatesEventModal = action.payload;
        })
        .addCase(activeCanvasTrigger, state => {
            state.canvasTrigger = !state.canvasTrigger ;
        })
        .addCase(toggleJoinModalShowed, state => {
            state.joinModalShowed = !state.joinModalShowed;
            state.eventModalShowed = false;
        })
        .addCase(toggleLoginModalShowed, state => {
            state.loginModalShowed = !state.loginModalShowed;
            state.eventModalShowed = false;
        })
        .addCase(userFetched, (state, action) => {
            state.user = action.payload;
            state.loadingUser = false;
        })
        .addCase(userFetching, (state, action) => {
            state.loadingUser = action.payload;
        })
        .addCase(setSelectedEvent, (state, action) => {
            state.idSelectedEvent = action.payload;
        })
        .addCase(setUserEvents, (state, action) => {
            state.userEvents = action.payload;
        })
        .addCase(setNumberOfColumns, (state, action) => {
            state.numberOfColumns = action.payload;
        })
        .addCase(toggleSidePanel, (state, action) => {
            state.sidePanelShown = action.payload;
        })
        .addCase(togglePastCell, (state, action) => {
            state.didPastCellClick = action.payload;
        })
        .addDefaultCase(()=>{})
})

export default reducer;