from csv import reader
from math import sqrt, exp, pi, pow
import os
import sys

# Load the samples


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

# Convert samples to float


def str_column_to_float(dataset, column):
    for row in dataset:
        row[column] = float(row[column].strip())

# Convert last column(class) from float to int


def float_class_column_to_int(dataset, column):
    for row in dataset:
        row[column] = int(row[column])

# Separate samples by class(steady = 0, decrease = 1)


def separate_by_class(dataset):
    separated = dict()
    for i in range(len(dataset)):
        vector = dataset[i]
        class_value = vector[-1]
        if (class_value not in separated):
            separated[class_value] = list()
        separated[class_value].append(vector)
    return separated

# Calculate the mean of a list of numbers


def calculate_mean(numbers):
    return sum(numbers)/float(len(numbers))

# Calculate the variance needed in computing the standard deviation


def calculate_variance(numbers):
    average = calculate_mean(numbers)
    deviations = [pow((x-average), 2) for x in numbers]
    variance = sum(deviations) / float(len(numbers))
    return variance

# Calculate the standard deviation after calculating the variance


def calculate_standard_deviation(numbers):
    calculated_variance = sqrt(calculate_variance(numbers))
    return calculated_variance

# Calculate the mean, standard deviation and count for each column in a dataset


def summarize_dataset(dataset):
    summaries = [(calculate_mean(column), calculate_standard_deviation(
        column), len(column)) for column in zip(*dataset)]
    del (summaries[-1])
    return summaries

# Split dataset by class then calculate statistics for each row


def summarize_by_class(dataset):
    separated = separate_by_class(dataset)
    summaries = dict()
    for class_value, rows in separated.items():
        summaries[class_value] = summarize_dataset(rows)
    return summaries

# Calculate the Gaussian probability distribution


def calculate_gaussian_probability(x, mean, standard_deviation):
    exponent = exp(-(pow((x-mean), 2) /
                   (2 * pow(standard_deviation, 2))))
    probability = (1 / (sqrt(2 * pi) * standard_deviation)) * exponent
    return probability

# Calculate the probabilities of predicting each class for a given row


def calculate_class_probabilities(summaries, row):
    total_rows = sum([summaries[label][0][2] for label in summaries])
    probabilities = dict()
    for class_value, class_summaries in summaries.items():
        probabilities[class_value] = summaries[class_value][0][2] / \
            float(total_rows)
        for i in range(len(class_summaries)):
            # 7. Get the computed mean, and standard deviation from the class summaries
            mean, standard_deviation, _ = class_summaries[i]
            # 8. Calculate the gaussian prob using the row (data from db), mean,  standard dev
            probabilities[class_value] *= calculate_gaussian_probability(
                row[i], mean, standard_deviation)
    return probabilities

# Predict the class for a given row


def predict(summaries, row):
    # 6. Pass the summarized class and the row (data from db) to compute the prob
    probabilities = calculate_class_probabilities(summaries, row)
    best_label, best_prob = None, -1
    for class_value, probability in probabilities.items():
        if best_label is None or probability > best_prob:
            best_prob = probability
            best_label = class_value
    # 9. Return the prediction
    return best_label


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


def main():
    # 4. Receive the data from the nodejs (database)
    # row = [0, 5, 12, 9, 5]
    product_name = sys.argv[1]
    product_sold_items = sys.argv[2]
    product_sales = sys.argv[3]
    current_date = sys.argv[4]
    current_month = sys.argv[5]
    product_name = int(product_name)
    product_sold_items = float(product_sold_items)
    product_sales = float(product_sales)
    current_date = float(current_date)
    current_month = float(current_month)
    row = [product_name, product_sold_items,
           product_sales, current_date, current_month]
    # Locate the dataset file
    filename = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
    csv_path = locate_dataset(row[0])
    dataset = load_csv(os.path.join(filename, csv_path))

    # Convert samples to float
    for i in range(len(dataset[0])):
        str_column_to_float(dataset, i)

    # Convert last column(decrease) from float to int
    float_class_column_to_int(dataset, len(dataset[0])-1)

    model = summarize_by_class(dataset)
    # row = [.35, 50]
    # Predict the result from a given row
    # 5. Use the received data (row), and the summarized class dataset (model) for prediction
    label = predict(model, row)

    # 10. Send the results to nodejs
    return label


label_predicted = main()
print(label_predicted)
sys.stdout.flush()
