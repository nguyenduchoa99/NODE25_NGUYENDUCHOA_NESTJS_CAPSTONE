import { ClassConstructor } from 'class-transformer';
import { registerDecorator, ValidationArguments, ValidatorOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export const Opposite = <T>(
    type: ClassConstructor<T>,
    property: (o: T) => any,
    validationOptions?: ValidatorOptions,

) => {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: OppositeConstraint,
        });
    };
};

@ValidatorConstraint({ name: 'Opposite' })
export class OppositeConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [fn] = args.constraints;
        return fn(args.object) === !value;
    }
    defaultMessage(args?: ValidationArguments) {
        const [constraintProperty]: Array<() => any> = args.constraints;
        return `Nếu ${(constraintProperty + '').split('.')[1]} là đúng, sau đó ${args.property} là sai và ngược lại`
    }
}