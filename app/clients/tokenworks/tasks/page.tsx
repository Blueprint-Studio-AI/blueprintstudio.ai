"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PrioritySelect, PRIORITIES } from '@/components/ui/priority-select';
import { toast } from '@/components/ui/use-toast';
import { Footer } from '@/components/Footer';
import { Spacer } from '@/components/ui/spacer';

const taskSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(PRIORITIES),
});

type TokenworksTaskFormData = z.infer<typeof taskSchema>;

export default function TokenworksTaskPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TokenworksTaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: '0'
    }
  });

  const priority = watch('priority');

  const onSubmit = async (data: TokenworksTaskFormData) => {
    setIsLoading(true);
    try {
      const formattedData = {
        title: data.title,
        description: `Submitted by: ${data.name}\n\n${data.description}`,
        priority: data.priority
      };

      const response = await fetch('/api/clients/tokenworks/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create task');
      }

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
    <div className="min-h-screen bg-white py-12 px-4">
    <Spacer size="md" />
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Tokenworks Task</h1>
          <p className="text-gray-600">
            Submit new tasks to Blueprint Studio
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Name
            </label>
            <Input
              {...register('name')}
              placeholder="Enter your name"
              className="w-full border border-gray-200 bg-white placeholder:text-gray-400"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Task Title
            </label>
            <Input
              {...register('title')}
              placeholder="Enter task title"
              className="w-full border border-gray-200 bg-white placeholder:text-gray-400"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <PrioritySelect
              value={priority}
              onChange={(value) => setValue('priority', value)}
              className="w-full border border-gray-200 bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              {...register('description')}
              placeholder="Describe the task in detail"
              className="w-full min-h-[150px] border border-gray-200 bg-white resize-y placeholder:text-gray-400"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-white text-[rgba(29,29,31,0.95)] rounded-xl
              border border-gray-200
              transition-all duration-200
              hover:border-gray-300 hover:bg-gray-50
              disabled:opacity-50 disabled:cursor-not-allowed
              font-medium text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Task...' : 'Create Task'}
          </Button>
        </form>
      </div>
      <Spacer size="4xl" />
    </div> 
    <Footer />
    </>
  );
}