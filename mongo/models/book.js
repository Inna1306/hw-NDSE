import mongoose, { Schema } from 'mongoose';

const bookSchema = new Schema({

    id: { type: String, index: true },

    title: { type: String, required: true, trim: true, default: '' },
    description: { type: String, default: '' },
    authors: { type: String, default: '' },
    favorite: { type: String, default: '' },
    fileCover: { type: String, default: '' },
    fileName: { type: String, default: '' },


    fileBook: { type: String, default: '' },
},
    {
        versionKey: false,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret._id = doc._id.toString();
                if (ret.id === undefined || ret.id === null) delete ret.id;
                return ret;
            },
        },
    }
);

export const Books = mongoose.model('Books', bookSchema, 'books');

export default Books;
