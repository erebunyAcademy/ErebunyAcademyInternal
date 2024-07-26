import React, { FC } from 'react'
import { Maybe } from '@/utils/models/common';
import { StudentNoCyclicScheduleListSingleType } from '@/utils/models/schedule';

type ThematicPlanProps = {
 isModalOpen: boolean;
  closeModal: () => void;
  selectedSchedule: Maybe<StudentNoCyclicScheduleListSingleType>;
}

const ThematicPlan:FC<ThematicPlanProps> = () => {
  return (
	<div>ThematicPlan</div>
  )
}

export default ThematicPlan