import { imgSnapshotTest } from '../../helpers/util.js';

describe('tube map', () => {
  it('should render a simple tube map', () => {
    imgSnapshotTest(
      `tubemap-beta
  title Hello world
  stop one
`
    );
  });
});
