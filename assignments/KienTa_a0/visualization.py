import matplotlib.pyplot as plt


def main():
    x_axis = ['18-24', '25-34', '35-44', '45-54', '65+']
    y_axis = [98, 86, 93, 82, 94]
    plt.bar(x_axis, y_axis, width=0.5, color='blue')
    plt.title('Subscriptions by Age')
    plt.xlabel('Age Group')
    plt.ylabel('Percentage')
    plt.savefig('corrected_visualization.png')


if __name__ == "__main__":
    main()
