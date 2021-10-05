const sortFunction = (a, b) => {
  switch (`${a.priority.toUpperCase()} ${b.priority.toUpperCase()}`) {
    case "HIGH HIGH":
        return 0;
        break;
          case "HIGH LOW":
            return -1;
            break;
            case "HIGH MIDDLE":
              return -1;
              break;
              case "MIDDLE MIDDLE":
                return 0;
                break;
                case "MIDDLE HIGH":
                  return 1;
                  break;
                  case "MIDDLE LOW":
                    return -1;
                    break;
                    case "LOW LOW":
                      return 0;
                      break;
                      case "LOW HIGH":
                        return 1;
                        break;
                        case "LOW MIDDLE":
                        return 1;
                        break;
                        default:
                          return 0;
                  }
};

export default sortFunction;