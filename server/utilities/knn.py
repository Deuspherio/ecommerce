from math import sqrt
import utils
import os
import sys


def dataset_minmax(dataset):
    minmax = list()
    for i in range(len(dataset[0])):
        col_values = [row[i] for row in dataset]
        value_min = min(col_values)
        value_max = max(col_values)
        minmax.append([value_min, value_max])
    return minmax


def normalize_dataset(dataset, minmax):
    for row in dataset:
        for i in range(len(row)):
            row[i] = (row[i] - minmax[i][0]) / (minmax[i][1] - minmax[i][0])


def euclidean_distance(row1, row2):
    distance = 0.0
    for i in range(len(row1)-1):
        distance += (row1[i] - row2[i])**2
    return sqrt(distance)


def get_neighbors(train, test_row, num_neighbors):
    distances = list()
    for train_row in train:
        dist = euclidean_distance(test_row, train_row)
        distances.append((train_row, dist))
    distances.sort(key=lambda tup: tup[1])
    neighbors = list()
    for i in range(num_neighbors):
        neighbors.append(distances[i][0])
    return neighbors


def predict_classification(train, test_row, num_neighbors):
    neighbors = get_neighbors(train, test_row, num_neighbors)
    output_values = [row[-1] for row in neighbors]
    prediction = max(set(output_values), key=output_values.count)
    return prediction


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
    for i in range(len(dataset[0])-1):
        utils.str_column_to_float(dataset, i)
    utils.float_class_column_to_int(dataset, len(dataset[0])-1)
    num_neighbors = 5
    label = predict_classification(dataset, row, num_neighbors)
    return label


label_predicted = main()
print(label_predicted)
sys.stdout.flush()
