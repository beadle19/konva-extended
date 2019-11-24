import React from 'react'
import Konva from 'konva'
import { Stage, Layer, Rect } from 'react-konva'
import { RectObj } from './widgets/rect2'

class Canvas extends React.PureComponent {
  // Component Refs
  layerRef = React.createRef()

  constructor(props) {
    super(props)

    this.state = {}
  }

  handleDragStart = e => {
    e.target.setAttrs({
      scaleX: 1.1,
      scaleY: 1.1,
    })
  }

  handleDragEnd = e => {
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5,
    })
  }

  createRect = uuid => {
    const rectRef = React.createRef()

    const onDragMove = (coordinates, e) => {
      this.onDragMove(coordinates, e, rectRef)
    }

    console.log('NEW : ', uuid / 2)
    return (
      <Rect
        draggable
        ref={rectRef}
        dragBoundFunc={onDragMove}
        key={uuid}
        x={Math.random() * window.innerWidth}
        y={Math.random() * window.innerHeight}
        width={50}
        height={50}
        fill={uuid / 2 === 0 ? 'red' : 'green'}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
      />
    )
  }

  // onDragMove = (coordinates, e, rect) => {
  //   const target = rect.current;
  //   const layer = this.layerRef;
  //   const siblings = layer.current.children;
  //   const targetRect = target.getClientRect();

  //   /**
  //    * Iterate through children
  //    * use for loop for performance optimization
  //    */
  //   for (let i = 0; i < siblings.length; i++) {
  //     const currSib = siblings[i];

  //     if (currSib === target) {
  //       continue;
  //     }

  //     const overlap = this.haveIntersection(currSib.getClientRect(), targetRect);
  //     debugger;
  //     const { x, y } = this.state;
  //     if (overlap === 'x') {
  //       currSib.attrs.fill = 'green';
  //       // return { x, y: coordinates.y };
  //     }

  //     if (overlap === 'y') {
  //       currSib.attrs.fill = 'red';
  //       // return { x: coordinates.x, y };
  //     }
  //   }

  //   this.setState({ x: coordinates.x, y: coordinates.y });
  //   return { x: coordinates.x, y: coordinates.y };
  // };

  // haveIntersection = (r1, r2) => {
  //   return !(
  //     r2.x > r1.x + r1.width ||
  //     r2.x + r2.width < r1.x ||
  //     r2.y > r1.y + r1.height ||
  //     r2.y + r2.height < r1.y
  //   );
  // };

  // haveIntersection2 = (r1, r2) => {
  //   if (r2.x > r1.x + r1.width || r2.x + r2.width < r1.x) {
  //     return 'x';
  //   }

  //   if (r2.y > r1.y + r1.height || r2.y + r2.height < r1.y) {
  //     return 'y';
  //   }
  // };

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={this.layerRef} width={window.innerWidth} height={window.innerHeight}>
          {[...Array(1)].map((_, i) => (
            <RectObj
              uuid={i}
              currLayer={this.layerRef}
              key={i}
              fill={i / 2 === 0 ? 'purple' : 'green'}
              nestedRect="NOTNESTED"
            >
              <RectObj
                x={10}
                y={10}
                width={50}
                height={50}
                fill="yellow"
                nestedRect="nestedRect"
                currLayer={this.layerRef}
              />
              <RectObj
                x={80}
                y={10}
                width={50}
                height={50}
                fill="yellow"
                nestedRect="nestedRect"
                currLayer={this.layerRef}
              />
            </RectObj>
          ))}
        </Layer>
      </Stage>
    )
  }
}

export { Canvas, Canvas as default }
