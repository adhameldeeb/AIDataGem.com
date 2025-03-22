
import React, { useMemo } from "react";
import { EmbeddingVisualizationData } from "@/lib/types";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { Card, CardContent } from "@/components/ui/card";

interface EmbeddingVisualizerProps {
  data: EmbeddingVisualizationData[];
}

export function EmbeddingVisualizer({ data }: EmbeddingVisualizerProps) {
  const chartData = useMemo(() => {
    const groups = data.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push({
        x: item.x,
        y: item.y,
        id: item.id,
        content: item.content
      });
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(groups).map(([id, data]) => ({
      id,
      data
    }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Upload and process files to visualize embeddings
      </div>
    );
  }

  return (
    <div className="h-full">
      <ResponsiveScatterPlot
        data={chartData}
        margin={{ top: 20, right: 140, bottom: 70, left: 90 }}
        xScale={{ type: 'linear', min: -1, max: 1 }}
        yScale={{ type: 'linear', min: -1, max: 1 }}
        blendMode="multiply"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Dimension 1',
          legendPosition: 'middle',
          legendOffset: 46
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Dimension 2',
          legendPosition: 'middle',
          legendOffset: -60
        }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: 'left-to-right',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        tooltip={({ node }) => (
          <Card className="max-w-xs">
            <CardContent className="p-2 text-xs">
              <p className="font-medium">{node.data.content.substring(0, 100)}{node.data.content.length > 100 ? '...' : ''}</p>
              <p className="text-muted-foreground mt-1">
                X: {node.x.toFixed(4)}, Y: {node.y.toFixed(4)}
              </p>
            </CardContent>
          </Card>
        )}
      />
    </div>
  );
}
