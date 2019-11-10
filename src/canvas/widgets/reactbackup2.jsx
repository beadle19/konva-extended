import React from 'react'
import { Rect } from 'react-konva'
import _ from 'lodash'

class RectObj extends React.PureComponent {
  rectRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {
      originalX: Math.random() * window.innerWidth,
      originalY: Math.random() * window.innerHeight,
    }
  }

  onDragMove = (coordinates, e) => {
    const rect = this.rectRef
    const target = rect.current
    const { currLayer } = this.props
    const siblings = currLayer.current.children
    let targetRect = target.getClientRect()
    let targetDirection = this.getObjMoveDirection(coordinates)

    targetDirection = targetDirection ? targetDirection : this.state.targetDirection
    console.log(targetDirection)
    /**
     * Iterate through children
     * use for loop for performance optimization
     */
    targetRect = { ...targetRect, ...coordinates }
    for (let i = 0; i < siblings.length; i++) {
      const currSib = siblings[i]
      const currSibRect = currSib.getClientRect()

      if (currSib === target) {
        continue
      }

      const overlap = this.haveIntersection(currSibRect, targetRect, targetDirection)

      if (!_.isEqual(targetRect, overlap)) {
        targetRect = { ...targetRect, x: overlap.x, y: overlap.y }
      }
    }

    // Track x, y coordinates in order to determine moving
    // direction of element
    this.setState({ x: coordinates.x, y: coordinates.y, targetDirection })

    return { x: targetRect.x, y: targetRect.y }
  }

  getObjMoveDirection = newCoordinates => {
    const { x, y } = this.state
    const { userJitter } = this.props

    let xAxisDiff = x ? newCoordinates.x - x : 0
    let yAxisDiff = y ? newCoordinates.y - y : 0

    xAxisDiff = Math.abs(xAxisDiff) > userJitter ? xAxisDiff : 0
    yAxisDiff = Math.abs(yAxisDiff) > userJitter ? yAxisDiff : 0

    let axisOfMovement
    let directionOfMovement

    // Axis of movent
    if (Math.abs(xAxisDiff) >= Math.abs(yAxisDiff)) {
      axisOfMovement = 'x'
    } else {
      axisOfMovement = 'y'
    }

    if (xAxisDiff !== 0 && axisOfMovement === 'x') {
      if (Math.sign(xAxisDiff) === 1) {
        directionOfMovement = 'right'
      } else if (Math.sign(xAxisDiff) === -1) {
        directionOfMovement = 'left'
      }
    } else if (yAxisDiff !== 0 && axisOfMovement === 'y') {
      if (Math.sign(yAxisDiff) === 1) {
        directionOfMovement = 'down'
      } else if (Math.sign(yAxisDiff) === -1) {
        directionOfMovement = 'up'
      }
    }

    return directionOfMovement
  }

  // THIS FUNCTION MUST RETURN EXACT COORDINATES
  // r1 is component being compared too
  // r2 is current moving component
  haveIntersection = (r1, r2, targetDirection) => {
    const currTargetCoords = { ...r2 }

    // X-axis overlap computation

    // If target is moving in the left direction
    if (targetDirection === 'left') {
      // If left of target is inbetween right and left of sibling
      // if (targetDirection === 'left' && r2.x < r1.x + r1.width && r2.x > r1.x) {
      if (r2.x < r1.x + r1.width && r2.x > r1.x) {
        // And if bottom of target is greater than top of sibling
        if (r2.y + r2.height > r1.y) {
          // And if top of target is less than bottom of sibling
          if (r2.y < r1.y + r1.height) {
            currTargetCoords.x = r1.x + r1.width
          }
        }
      }

      // If right of target is inbetween left and right of sibling
      if (
        // targetDirection === 'right' &&
        r2.x + r2.width > r1.x &&
        r2.x + r2.height < r1.x + r1.width
      ) {
        // If bottom of target is greater than top of sibling
        if (r2.y + r2.height > r1.y) {
          // And if top of target is less than bottom of sibling
          if (r2.y < r1.y + r1.height) {
            currTargetCoords.x = r1.x - r2.width
          }
        }
      }
    }

    // If target is moving in the right direction
    if (targetDirection === 'right') {
      // If right of target is inbetween left and right of sibling
      if (
        // targetDirection === 'right' &&
        r2.x + r2.width > r1.x &&
        r2.x + r2.height < r1.x + r1.width
      ) {
        // If bottom of target is greater than top of sibling
        if (r2.y + r2.height > r1.y) {
          // And if top of target is less than bottom of sibling
          if (r2.y < r1.y + r1.height) {
            currTargetCoords.x = r1.x - r2.width
          }
        }
      }

      if (r2.x < r1.x + r1.width && r2.x > r1.x) {
        // And if bottom of target is greater than top of sibling
        if (r2.y + r2.height > r1.y) {
          // And if top of target is less than bottom of sibling
          if (r2.y < r1.y + r1.height) {
            currTargetCoords.x = r1.x + r1.width
          }
        }
      }
    }

    // Y-axis overlap computation

    // If target is moving in the up direction
    if (targetDirection === 'up') {
      // If top of target is inbetween bottom and top of sibling
      // if (targetDirection === 'up' && r2.y < r1.y + r1.height && r2.y > r1.y) {
      if (r2.y < r1.y + r1.height && r2.y > r1.y) {
        // If right of target is greater than left of sibling
        if (r2.x + r2.width > r1.x) {
          // If left of target is less than right of sibling
          if (r2.x < r1.x + r1.width) {
            currTargetCoords.y = r1.y + r1.height
          }
        }
        // If bottom of target is inbetwen top and bottom of sibling
      }
    }

    // If target is moving in the down direction
    if (targetDirection === 'down') {
      if (
        // targetDirection === 'bottom' &&
        r2.y + r2.height > r1.y &&
        r2.y + r2.height < r1.y + r1.height
      ) {
        // If right of target is greater than left of sibling
        if (r2.x + r2.width > r1.x) {
          // If left of target is less than right of sibling
          if (r2.x < r1.x + r1.width) {
            currTargetCoords.y = r1.y - r2.height
          }
        }
      }
    }

    return currTargetCoords
  }

  render() {
    const { originalX, originalY } = this.state
    const { uuid } = this.props
    return (
      <Rect
        draggable
        ref={this.rectRef}
        dragBoundFunc={this.onDragMove}
        key={uuid}
        x={originalX}
        y={originalY}
        width={50}
        height={50}
        fill={uuid / 2 === 0 ? 'red' : 'green'}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    )
  }
}

RectObj.defaultProps = {
  /**
   * userJitter is a variable to provide a buffer
   * when calculating the direction an object is
   * moving in.  This only applies when preventOverlap
   * is true and it accounts for when a user jitters in
   * the opposite axis direction when dragging an object.
   * Ex. User drags left, so movement is left but there is
   * a slight mouse jitter vertically when this is being
   * dragged.
   */
  userJitter: 0,
}

export { RectObj, RectObj as default }
