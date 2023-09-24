from csv import reader


def load_csv(filename):
    dataset = list()
    with open(filename, 'r') as file:
        csv_reader = reader(file)
        next(csv_reader, None)
        for row in csv_reader:
            if not row:
                continue
            dataset.append(row)
    return dataset


def str_column_to_float(dataset, column):
    for row in dataset:
        row[column] = float(row[column])


def float_class_column_to_int(dataset, column):
    for row in dataset:
        row[column] = int(row[column])


def locate_dataset(name):
    match name:
        case 0:
            return 'product0.training.dataset.csv'
        case 1:
            return 'product1.training.dataset.csv'
        case 2:
            return 'product2.training.dataset.csv'
        case 3:
            return 'product3.training.dataset.csv'
        case 4:
            return 'product4.training.dataset.csv'
        case 5:
            return 'product5.training.dataset.csv'
        case 6:
            return 'product6.training.dataset.csv'
        case 7:
            return 'product7.training.dataset.csv'
        case 8:
            return 'product8.training.dataset.csv'
        case 9:
            return 'product9.training.dataset.csv'
        case 10:
            return 'product10.training.dataset.csv'
        case 11:
            return 'product11.training.dataset.csv'
        case 12:
            return 'product12.training.dataset.csv'
        case 13:
            return 'product13.training.dataset.csv'
        case 14:
            return 'product14.training.dataset.csv'
        case 15:
            return 'product15.training.dataset.csv'
        case 16:
            return 'product16.training.dataset.csv'
        case 17:
            return 'product17.training.dataset.csv'
