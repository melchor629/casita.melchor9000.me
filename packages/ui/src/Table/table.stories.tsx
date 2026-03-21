import type { Meta, StoryObj } from '@storybook/react-vite'
import Button from '../Button'
import { Home } from '../icons'
import Table from './table'
import TableBody from './table-body'
import TableCell from './table-cell'
import TableContainer from './table-container'
import TableHead from './table-head'
import TableHeadCell from './table-head-cell'
import TableRow from './table-row'

const meta = {
  title: 'atoms/Table',
  component: Table,
  render: (props) => (
    <Table {...props}>
      <TableHead>
        <TableRow>
          <TableHeadCell shrink>ID</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell shrink>#</TableHeadCell>
          <TableHeadCell shrink />
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableHeadCell colSpan={4}>Food</TableHeadCell>
        </TableRow>
        <TableRow>
          <TableCell>32</TableCell>
          <TableCell>Bread</TableCell>
          <TableCell>592</TableCell>
          <TableCell><Button icon={<Home />} size="small" variant="text" /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>54</TableCell>
          <TableCell>Cheese</TableCell>
          <TableCell>205</TableCell>
          <TableCell><Button icon={<Home />} size="small" variant="text" /></TableCell>
        </TableRow>

        <TableRow>
          <TableHeadCell colSpan={4}>Tools</TableHeadCell>
        </TableRow>
        <TableRow>
          <TableCell>581</TableCell>
          <TableCell>Wrench</TableCell>
          <TableCell>12</TableCell>
          <TableCell><Button icon={<Home />} size="small" variant="text" /></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>582</TableCell>
          <TableCell>Screwdriver</TableCell>
          <TableCell>8</TableCell>
          <TableCell><Button icon={<Home />} size="small" variant="text" /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  subcomponents: {
    TableHead,
    TableBody,
    TableRow,
    TableHeadCell,
    TableCell,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    full: false,
    hover: false,
    noWrap: false,
  },
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithContainer: Story = {
  decorators: [
    (Story) => <TableContainer className="min-w-[80dvw]"><Story /></TableContainer>,
  ],
  args: {
    full: true,
    noWrap: true,
  },
}
