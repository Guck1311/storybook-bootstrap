import type { Meta, StoryObj } from '@storybook/angular';
import { expect } from 'storybook/test';

import { UiComponents } from './ui-components';

const meta: Meta<UiComponents> = {
  component: UiComponents,
  title: 'UiComponents',
};
export default meta;
type Story = StoryObj<UiComponents>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/ui-components works!/gi)).toBeTruthy();
  },
};
