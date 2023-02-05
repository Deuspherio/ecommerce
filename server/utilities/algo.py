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


# Locate the sample file (decrease.csv)
filename = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
csv_path = 'decrease.csv'
dataset = load_csv(os.path.join(filename, csv_path))

# Convert samples to float
for i in range(len(dataset[0])):
    str_column_to_float(dataset, i)

# Convert last column(decrease) from float to int
float_class_column_to_int(dataset, len(dataset[0])-1)

# 4. Receive the data from the nodejs (database)
sales = sys.argv[1]
stocks = sys.argv[2]
sales = float(sales)
stocks = float(stocks)
row = [sales, stocks]

model = summarize_by_class(dataset)
# row = [.35, 50]
# Predict the result from a given row
# 5. Use the received data (row), and the summarized class dataset (model) for prediction
label = predict(model, row)

# 10. Send the results to nodejs
print(label)
sys.stdout.flush()
