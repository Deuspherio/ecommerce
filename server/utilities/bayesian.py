from math import sqrt, exp, pi, pow
import os
import sys
import utils


def separate_by_class(dataset):
    separated = dict()
    for i in range(len(dataset)):
        vector = dataset[i]
        class_value = vector[-1]
        if (class_value not in separated):
            separated[class_value] = list()
        separated[class_value].append(vector)
    return separated


def calculate_mean(numbers):
    return sum(numbers)/float(len(numbers))


def calculate_variance(numbers):
    average = calculate_mean(numbers)
    deviations = [pow((x-average), 2) for x in numbers]
    variance = sum(deviations) / float(len(numbers))
    return variance


def calculate_standard_deviation(numbers):
    calculated_variance = sqrt(calculate_variance(numbers))
    return calculated_variance


def summarize_dataset(dataset):
    summaries = [(calculate_mean(column), calculate_standard_deviation(
        column), len(column)) for column in zip(*dataset)]
    del (summaries[-1])
    return summaries


def summarize_by_class(dataset):
    separated = separate_by_class(dataset)
    summaries = dict()
    for class_value, rows in separated.items():
        summaries[class_value] = summarize_dataset(rows)
    return summaries


def calculate_gaussian_probability(x, mean, standard_deviation):
    exponent = exp(-(pow((x-mean), 2) /
                   (2 * pow(standard_deviation, 2))))
    probability = (1 / (sqrt(2 * pi) * standard_deviation)) * exponent
    return probability


def calculate_class_probabilities(summaries, row):
    total_rows = sum([summaries[label][0][2] for label in summaries])
    probabilities = dict()
    for class_value, class_summaries in summaries.items():
        probabilities[class_value] = summaries[class_value][0][2] / \
            float(total_rows)
        for i in range(len(class_summaries)):
            mean, standard_deviation, _ = class_summaries[i]
            probabilities[class_value] *= calculate_gaussian_probability(
                row[i], mean, standard_deviation)
    return probabilities


def predict(summaries, row):
    probabilities = calculate_class_probabilities(summaries, row)
    best_label, best_prob = None, -1
    for class_value, probability in probabilities.items():
        if best_label is None or probability > best_prob:
            best_prob = probability
            best_label = class_value
    return best_label


def main():
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
    filename = os.path.abspath(os.path.dirname(os.path.realpath(__file__)))
    csv_path = utils.locate_dataset(row[0])
    dataset = utils.load_csv(os.path.join(filename, csv_path))
    for i in range(len(dataset[0])):
        utils.str_column_to_float(dataset, i)
    utils.float_class_column_to_int(dataset, len(dataset[0])-1)
    model = summarize_by_class(dataset)
    label = predict(model, row)
    return label


label_predicted = main()
print(label_predicted)
sys.stdout.flush()
