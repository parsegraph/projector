# parsegraph-projector

This module provides an interface for painting and rendering an object independent
of its rendering context. This is accomplished through two interfaces: Projector
and Projected. To bridge these together to use in a TimingBelt, use Projection.

For a default projector, use BasicProjector.
