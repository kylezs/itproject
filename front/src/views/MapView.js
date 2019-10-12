import React from 'react'
import { Popover } from '@material-ui/core'
import { Loading, Map, geocodeQuery } from '../components'

import {
    GetArtefactWrapper,
    GetFamiliesWrapper,
    GetStatesWrapper
} from '../components'

// first need to get all artefacts a user has access to view
// GQL query like:
// me -> isMemberOf -> familiy -> hasArtefacts -> edges -> node -> {atrefact details required}

