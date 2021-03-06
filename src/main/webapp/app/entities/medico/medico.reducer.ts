import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IMEDICO, defaultValue } from 'app/shared/model/medico.model';

export const ACTION_TYPES = {
  FETCH_MEDICO_LIST: 'mEDICO/FETCH_MEDICO_LIST',
  FETCH_MEDICO: 'mEDICO/FETCH_MEDICO',
  CREATE_MEDICO: 'mEDICO/CREATE_MEDICO',
  UPDATE_MEDICO: 'mEDICO/UPDATE_MEDICO',
  PARTIAL_UPDATE_MEDICO: 'mEDICO/PARTIAL_UPDATE_MEDICO',
  DELETE_MEDICO: 'mEDICO/DELETE_MEDICO',
  RESET: 'mEDICO/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IMEDICO>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type MEDICOState = Readonly<typeof initialState>;

// Reducer

export default (state: MEDICOState = initialState, action): MEDICOState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_MEDICO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_MEDICO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_MEDICO):
    case REQUEST(ACTION_TYPES.UPDATE_MEDICO):
    case REQUEST(ACTION_TYPES.DELETE_MEDICO):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_MEDICO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_MEDICO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_MEDICO):
    case FAILURE(ACTION_TYPES.CREATE_MEDICO):
    case FAILURE(ACTION_TYPES.UPDATE_MEDICO):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_MEDICO):
    case FAILURE(ACTION_TYPES.DELETE_MEDICO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_MEDICO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_MEDICO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_MEDICO):
    case SUCCESS(ACTION_TYPES.UPDATE_MEDICO):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_MEDICO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_MEDICO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/medicos';

// Actions

export const getEntities: ICrudGetAllAction<IMEDICO> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_MEDICO_LIST,
    payload: axios.get<IMEDICO>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IMEDICO> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_MEDICO,
    payload: axios.get<IMEDICO>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IMEDICO> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_MEDICO,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IMEDICO> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_MEDICO,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IMEDICO> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_MEDICO,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IMEDICO> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_MEDICO,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
