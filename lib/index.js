/* eslint-disable new-cap */

import { Either } from 'monet';

const { Left, Right } = Either;

/**
 *
 * @param {object} [config]
 * @param {string} state
 * @return {object}
 */
export default function (config = {}, state) {
  return Right({ config, state })
    .flatMap(handleMissingState)
    .map(maybeExtendConfig)
    .map(removeStates)
    .cata(throwError, returnValue);
}

/**
 *
 * @param {object} config
 * @param {string} state
 * @return {object}
 */
function extendConfig(config, state) {
  return { config: { ...config, ...config._states[state] }, state };
}

/**
 *
 * @param {Error} e
 */
function throwError(e) {
  throw e;
}

/**
 *
 * @param {*} result
 * @return {*}
 */
function returnValue(result) {
  return result;
}

/**
 *
 * @param { Either<Error, {config, state}> } args
 * @return { Either<Error, {config, state}> }
 */
function removeStates(args) {
  const { config } = args;
  delete config._states;
  return config;
}

/**
 * If the state is set we extend the state config onto the main config object.
 *
 * @param { Either<Error, {config, state}> } args
 * @return { Either<Error, {config, state}> }
 */
function maybeExtendConfig(args) {
  const { config, state } = args;
  return state
    ? extendConfig(config, state)
    : { config, state };
}

/**
 * If the state is set and cannot be found in config._states, we're going to
 * fail fast by returning a Left, otherwise we return a Right.
 *
 * @param { { config, state } } args
 * @return { Either<Error, { config, state }> }
 */
function handleMissingState(args) {
  const { config, state } = args;
  return (state && (!config._states || !config._states[state]))
    ? Left(new Error(`State '${state}' is not defined.`))
    : Right({ config, state });
}
