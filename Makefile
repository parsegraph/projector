DIST_NAME = projector

SCRIPT_FILES = \
	src/index.ts \
	src/Projected.ts \
	src/ImageProjector.ts \
	src/AbstractProjector.ts \
	src/screenshot.ts \
	src/SharedProjector.ts \
	src/BasicProjector.ts \
	src/Projection.ts \
	src/Projector.ts \
	src/demo.ts \
	test/test.ts

EXTRA_SCRIPTS =

include ./Makefile.microproject
