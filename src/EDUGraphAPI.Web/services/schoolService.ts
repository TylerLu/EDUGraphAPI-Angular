import express = require('express');
import * as Sequelize from 'sequelize';
import { DbContext, ClassroomSeatingArrangementAttributes } from '../data/dbContext';

export class SchoolService {

    private dbContext = new DbContext();

    public getSeatingArrangementsAsync(classId: string): Promise<ClassroomSeatingArrangementAttributes[]> {
        return new Promise<ClassroomSeatingArrangementAttributes[]>((resolve, reject) => {
            this.dbContext.ClassroomSeatingArrangement
                .findAll({ where: { classId: classId } })
                .then(arrangement => resolve(arrangement))
                .catch(reject);
        });
    }

    public updateSeatingArrangementsAsync(classId: string, newItems: ClassroomSeatingArrangementAttributes[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dbContext.ClassroomSeatingArrangement
                .findAll({ where: { classId: classId } })
                .then(oldItems => {
                    newItems.forEach(newItem => {
                        var oldItemIndex = oldItems.findIndex(i => i.o365UserId == newItem.o365UserId);
                        if (oldItemIndex >= 0) {
                            var oldItem = oldItems[oldItemIndex];
                            oldItem.position = newItem.position;
                            oldItem.save();
                        }
                        else {
                            newItem.classId = classId;
                            this.dbContext.ClassroomSeatingArrangement.create(newItem);
                        }
                    });
                    oldItems.forEach(oldItem => {
                        if (newItems.findIndex(i => i.o365UserId == oldItem.o365UserId) < 0) {
                            oldItem.destroy();
                        }
                    });
                    resolve();
                })
                .catch(reject);
        });
    }
}