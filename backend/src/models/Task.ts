import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    user: mongoose.Schema.Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    isStarred: boolean;
}

const TaskSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    isStarred: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
