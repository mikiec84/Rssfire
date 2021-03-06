import React from 'react';
import { StyleSheet, TouchableHighlight, Text, Image, View } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: 85,
    height: 85,
    marginRight: 10,
    borderRadius: 5,
  },
  textContainer: {
    width: 0,
    flexGrow: 1,
    flex: 1,
  },
  textTitle : {
    marginBottom: 3,
    fontWeight: 'bold',
    fontSize: 17,
  },
  textBottom : {
    marginTop: 6,
    fontSize: 12,
  },
  textDescription: {
    fontSize: 13,
  },
});

export const FeedItem = ({onPress, item, index}) => {
  const {
    image,
    title,
    link,
    pubDate,
    description,
    content,
    siteName,
  } = item;

  let timeDiff = moment(pubDate).fromNow();

  const hasImage = image !== undefined;

  return (
    <TouchableHighlight
      key={index}
      activeOpacity={0.9}
      underlayColor={'white'}
      onPress={() => onPress(item)}
    >
      <View style={styles.itemContainer}>
        {hasImage ?
          <Image
            style={styles.imageContainer}
            source={{uri: image[0]}}
          />
          : null
        }
        <View style={styles.textContainer}>
          <Text style={styles.textTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.textDescription} numberOfLines={2}>{description}</Text>
          <Text style={styles.textBottom} numberOfLines={1}>
            <Text>{siteName.length < 20 ? siteName : `${siteName.substring(0, 20)}...`}</Text>
            <Text> | </Text>
            <Text>{timeDiff}</Text>
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}
