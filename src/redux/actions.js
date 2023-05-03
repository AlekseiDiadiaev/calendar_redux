import { createAction } from "@reduxjs/toolkit";


export const setSelectedDate = createAction('SET_SELECTED_DATE');

export const setScrollToHour = createAction('SET_SCROLL_TO_HOUR');

export const navBtnsClick = createAction('NAV_BTNS_CLICK', value => {
    return {payload: value * 86400000}   
});

export const toggleEventModal = createAction('TOGGLE_IVENT_MODAL');

export const setEventModalDate = createAction('SET_IVENT_MODAL_DATE');

export const setIdСhosenCell = createAction('SET_ID_CHOSEN_CELL');

export const setCoordinatesСhosenCell = createAction('SET_COORDINATES_CHOSEN_CELL');

export const setCoordinatesEventModal = createAction('SET_COORDINATES_IVENT_MODAL');

export const activeCanvasTrigger = createAction('ACTIVE_CANVAS_TRIGGER');
    
export const toggleJoinModalShowed = createAction('TOGGLE_JOIN_MODAL_SHOWED');

export const toggleLoginModalShowed = createAction('TOGGLE_LOGIN_MODAL_SHOWED');

export const userFetched = createAction('USER_FETCHED');

export const userFetching = createAction('USER_FETCHING');

export const setSelectedEvent = createAction('SET_SELECTED_IVENT');

export const setUserEvents = createAction('SET_USER_IVENTS');

export const setNumberOfColumns = createAction('SET_NUMBER_OF_COLUMNS');

export const toggleSidePanel = createAction('TOGGLE_SIDE_PANEL');

export const togglePastCell = createAction('TOGGLE_PAST_CELL');