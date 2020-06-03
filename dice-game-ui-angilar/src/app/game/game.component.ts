import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public field_size = 0;  

  constructor() {
    this.field_size = 15;
    this.loadD3Script();
   }

  ngOnInit(): void {
  }


  public loadD3Script(){
    document.addEventListener("DOMContentLoaded", () => {

      let selecting = false;
      let points = [];

      const svg = d3.select("#canv");
      const canvas_width = svg.node().getBoundingClientRect().width;
      let start_point = null;

      function render_field(size) {
        let rect_side = canvas_width / size
        let border = rect_side * 0.01;

        //add
        svg.selectAll('rect').data(points).enter().append('rect')
          .attr('x', function (d) { return d.x * rect_side + d.x * border; })
          .attr('y', function (d) { return d.y * rect_side + d.y * border; })
          .attr('height', rect_side)
          .attr('width', rect_side)
          .attr('data-point-x', function (d) { return d.x; })
          .attr('data-point-y', function (d) { return d.y; })
          .on('mousedown', function () {
            selecting = true;
            let rect = d3.select(this);
            rect.style('fill', 'blue');
            start_point = { 'x': rect.attr("data-point-x"), 'y': rect.attr("data-point-y") };
          })
          .on('mouseup', function () {
            start_point = null;
            selecting = false;
          })
          .on('mouseover', function () {
            if (selecting) {
              const rect = d3.select(this);
              rect.style('fill', 'blue');
              set_neighbors(start_point, { 'x': rect.attr('data-point-x'), 'y': rect.attr('data-point-y') }, size);
            }
          })
          .style('fill', 'lightblue');

        svg.selectAll('rect').data(points)
          .style('fill', function (d) {
            if (d.set === true)
              return "red";
            else if (d.sel === true)
              return 'blue';
            else
              return 'lightblue';
          });

        svg.selectAll('rect').data(points).exit().remove();
      }

      function set_neighbors(start_point, end_point, size) {
        if (start_point == null) {
          return;
        }
        const d1 = 2;
        const d2 = 3;
        let maxDice = Math.max(d1, d2);
        let minDice = Math.min(d1, d2);
        const minX = Math.min(start_point.x, end_point.x);
        const minY = Math.min(start_point.y, end_point.y);
        const maxX = Math.max(start_point.x, end_point.x);
        const maxY = Math.max(start_point.y, end_point.y);

        //let curX = 0;
        //let curY = 0;
        //const selectedRect = points.filter(p => p.x <= maxX && p.x >= minX && p.y <= maxY && p.y >= minY, points);
        //const xMaxLen = Math.max(Math.abs(start_point.x - end_point.x), start_point.x + d1, start_point.x + d2);

        for (let i = 0; i < points.length; i++) {
          if (points[i].x <= maxX && points[i].x >= minX && points[i].y <= maxY && points[i].y >= minY){
              points[i].sel = true;
            }
          else
            points[i].sel = false;
        }
        render_field(size);
      }

      function setPoints(size) {
        points = [];
        render_field(size);
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            let s = false;
            if (i < 3 && j < 5)
            s = true;
            points.push({ 'x': i, 'y': j, 'sel': false, 'set': s });
          }
        }
        render_field(size);
      }

      setPoints(this.field_size);
    })
  }
}
