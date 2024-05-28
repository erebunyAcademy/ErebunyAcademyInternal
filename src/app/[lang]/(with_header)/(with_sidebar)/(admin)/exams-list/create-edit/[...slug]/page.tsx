import CreateEditExam from '@/components/pages/CreateEditExam';

const CreateEdit = async ({ params }: { params: { slug: string[] } }) => {
  const [examId, subjectId] = params.slug;

  return <CreateEditExam examId={examId} subjectId={subjectId} />;
};

export default CreateEdit;
